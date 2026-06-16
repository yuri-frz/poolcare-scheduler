import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Role = "CLIENT" | "PROVIDER";
type ServiceKey = "auth" | "scheduling" | "notification";

type UserSession = {
  email: string;
  role: Role;
  token: string;
  userId?: string;
};

type Schedule = {
  id: string;
  clientId: string;
  providerId: string;
  serviceDate: string;
  address: string;
  notes?: string;
  status: "REQUESTED" | "CONFIRMED" | "CANCELLED" | "DONE";
};

type NotificationLog = {
  id: string;
  recipientId: string;
  subject: string;
  message: string;
  sentAt: string;
};

type HealthState = Record<ServiceKey, "checking" | "online" | "offline">;

const servicePorts: Record<ServiceKey, number> = {
  auth: 3001,
  scheduling: 3002,
  notification: 3003
};

function serviceUrl(service: ServiceKey) {
  const envKey = `VITE_${service.toUpperCase()}_URL`;
  const envValue = import.meta.env[envKey] as string | undefined;

  if (envValue) {
    return envValue;
  }

  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:${servicePorts[service]}`;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message ?? "Nao foi possivel completar a operacao.");
  }

  return payload as T;
}

function App() {
  const [health, setHealth] = useState<HealthState>({
    auth: "checking",
    scheduling: "checking",
    notification: "checking"
  });
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem("poolcare-session");
    return saved ? JSON.parse(saved) as UserSession : null;
  });
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authForm, setAuthForm] = useState({
    name: "Ana Cliente",
    email: "ana@example.com",
    password: "123456",
    role: "CLIENT" as Role
  });
  const [scheduleForm, setScheduleForm] = useState({
    providerId: "provider-1",
    serviceDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    address: "Rua Azul, 10",
    basePrice: "120",
    notes: "Limpeza e verificacao de cloro"
  });
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const urls = useMemo(() => ({
    auth: serviceUrl("auth"),
    scheduling: serviceUrl("scheduling"),
    notification: serviceUrl("notification")
  }), []);

  useEffect(() => {
    checkHealth();
  }, []);

  useEffect(() => {
    if (session) {
      localStorage.setItem("poolcare-session", JSON.stringify(session));
      loadSchedules(session.token);
    } else {
      localStorage.removeItem("poolcare-session");
      setSchedules([]);
    }
  }, [session]);

  async function checkHealth() {
    const entries = await Promise.all(
      (Object.keys(servicePorts) as ServiceKey[]).map(async (service) => {
        try {
          await request(`${urls[service]}/health`);
          return [service, "online"] as const;
        } catch {
          return [service, "offline"] as const;
        }
      })
    );

    setHealth(Object.fromEntries(entries) as HealthState);
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError("");
    setMessage("");

    try {
      let registeredId: string | undefined;

      if (authMode === "register") {
        const created = await request<{ id: string }>(`${urls.auth}/auth/register`, {
          method: "POST",
          body: JSON.stringify(authForm)
        });
        registeredId = created.id;
      }

      const result = await request<{ token: string }>(`${urls.auth}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email: authForm.email, password: authForm.password })
      });

      setSession({
        email: authForm.email,
        role: authForm.role,
        token: result.token,
        userId: registeredId
      });
      setMessage(authMode === "register" ? "Conta criada e sessao iniciada." : "Sessao iniciada.");
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setIsBusy(false);
    }
  }

  async function loadSchedules(token = session?.token) {
    if (!token) {
      return;
    }

    setError("");

    try {
      const data = await request<Schedule[]>(`${urls.scheduling}/schedules/mine`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules(data);
    } catch (caught) {
      setError((caught as Error).message);
    }
  }

  async function createSchedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      return;
    }

    setIsBusy(true);
    setError("");
    setMessage("");

    try {
      await request<Schedule>(`${urls.scheduling}/schedules`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({
          ...scheduleForm,
          serviceDate: new Date(scheduleForm.serviceDate).toISOString(),
          basePrice: Number(scheduleForm.basePrice)
        })
      });
      setMessage("Agendamento criado.");
      await loadSchedules();
      await loadLogs();
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setIsBusy(false);
    }
  }

  async function updateSchedule(id: string, action: "confirm" | "complete" | "cancel") {
    if (!session) {
      return;
    }

    setIsBusy(true);
    setError("");
    setMessage("");

    try {
      await request<Schedule>(`${urls.scheduling}/schedules/${id}/${action}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.token}` }
      });
      setMessage("Agendamento atualizado.");
      await loadSchedules();
      await loadLogs();
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setIsBusy(false);
    }
  }

  async function loadLogs() {
    setError("");

    try {
      const data = await request<NotificationLog[]>(`${urls.notification}/notifications`);
      setLogs(data);
    } catch (caught) {
      setError((caught as Error).message);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">PoolCare Scheduler</p>
          <h1>Agenda de manutencao de piscinas</h1>
          <p className="hero-copy">
            Painel rapido para testar cadastro, login, agendamentos e notificacoes dos tres microsservicos.
          </p>
        </div>
        <div className="status-grid">
          {(Object.keys(health) as ServiceKey[]).map((service) => (
            <div className="status-pill" key={service}>
              <span className={`status-dot ${health[service]}`} />
              <span>{service}</span>
            </div>
          ))}
        </div>
      </section>

      {(message || error) && (
        <div className={error ? "alert error" : "alert success"}>
          {error || message}
        </div>
      )}

      <section className="workspace">
        <form className="panel auth-panel" onSubmit={handleAuth}>
          <div className="panel-heading">
            <h2>Acesso</h2>
            <div className="segmented">
              <button type="button" className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>Cadastrar</button>
              <button type="button" className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>Entrar</button>
            </div>
          </div>

          {authMode === "register" && (
            <label>
              Nome
              <input value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} required />
            </label>
          )}

          <label>
            E-mail
            <input type="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} required />
          </label>

          <label>
            Senha
            <input type="password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} required minLength={6} />
          </label>

          <label>
            Perfil
            <select value={authForm.role} onChange={(event) => setAuthForm({ ...authForm, role: event.target.value as Role })}>
              <option value="CLIENT">Cliente</option>
              <option value="PROVIDER">Prestador</option>
            </select>
          </label>

          <button className="primary-button" type="submit" disabled={isBusy}>
            {authMode === "register" ? "Criar conta" : "Entrar"}
          </button>

          {session && (
            <div className="session-card">
              <strong>{session.email}</strong>
              <span>{session.role === "CLIENT" ? "Cliente" : "Prestador"}</span>
              {session.userId && <code>{session.userId}</code>}
              <button type="button" onClick={() => setSession(null)}>Sair</button>
            </div>
          )}
        </form>

        <form className="panel" onSubmit={createSchedule}>
          <div className="panel-heading">
            <h2>Novo agendamento</h2>
          </div>

          <label>
            ID do prestador
            <input value={scheduleForm.providerId} onChange={(event) => setScheduleForm({ ...scheduleForm, providerId: event.target.value })} required />
          </label>

          <label>
            Data e hora
            <input type="datetime-local" value={scheduleForm.serviceDate} onChange={(event) => setScheduleForm({ ...scheduleForm, serviceDate: event.target.value })} required />
          </label>

          <label>
            Endereco
            <input value={scheduleForm.address} onChange={(event) => setScheduleForm({ ...scheduleForm, address: event.target.value })} required />
          </label>

          <label>
            Valor base
            <input type="number" min="0" value={scheduleForm.basePrice} onChange={(event) => setScheduleForm({ ...scheduleForm, basePrice: event.target.value })} required />
          </label>

          <label>
            Observacoes
            <textarea value={scheduleForm.notes} onChange={(event) => setScheduleForm({ ...scheduleForm, notes: event.target.value })} />
          </label>

          <button className="primary-button" type="submit" disabled={!session || isBusy}>
            Criar agendamento
          </button>
        </form>
      </section>

      <section className="content-grid">
        <div className="panel list-panel">
          <div className="panel-heading">
            <h2>Minha agenda</h2>
            <button type="button" onClick={() => loadSchedules()} disabled={!session}>Atualizar</button>
          </div>

          {schedules.length === 0 ? (
            <p className="empty-state">Nenhum agendamento encontrado para a sessao atual.</p>
          ) : (
            <div className="schedule-list">
              {schedules.map((schedule) => (
                <article className="schedule-card" key={schedule.id}>
                  <div>
                    <span className={`badge ${schedule.status.toLowerCase()}`}>{schedule.status}</span>
                    <h3>{schedule.address}</h3>
                    <p>{new Date(schedule.serviceDate).toLocaleString("pt-BR")}</p>
                    <small>Cliente: {schedule.clientId}</small>
                    <small>Prestador: {schedule.providerId}</small>
                    {schedule.notes && <p>{schedule.notes}</p>}
                  </div>
                  <div className="action-row">
                    <button type="button" onClick={() => updateSchedule(schedule.id, "confirm")} disabled={isBusy || schedule.status !== "REQUESTED"}>Confirmar</button>
                    <button type="button" onClick={() => updateSchedule(schedule.id, "complete")} disabled={isBusy || schedule.status !== "CONFIRMED"}>Concluir</button>
                    <button type="button" onClick={() => updateSchedule(schedule.id, "cancel")} disabled={isBusy || schedule.status === "DONE" || schedule.status === "CANCELLED"}>Cancelar</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="panel list-panel">
          <div className="panel-heading">
            <h2>Notificacoes</h2>
            <button type="button" onClick={loadLogs}>Atualizar</button>
          </div>

          {logs.length === 0 ? (
            <p className="empty-state">Nenhuma notificacao registrada.</p>
          ) : (
            <div className="log-list">
              {logs.map((log) => (
                <article className="log-card" key={log.id}>
                  <strong>{log.subject}</strong>
                  <span>{log.recipientId}</span>
                  <p>{log.message}</p>
                  <small>{new Date(log.sentAt).toLocaleString("pt-BR")}</small>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
