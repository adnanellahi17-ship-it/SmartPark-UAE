import { CheckCircle2, GraduationCap, ShieldCheck, UserRound } from "lucide-react";
import { appMetrics } from "../data/parking";

export function ProfileView() {
  return (
    <section className="tab-view" aria-label="Profile">
      <div className="view-heading">
        <span className="view-icon" aria-hidden="true">
          <UserRound size={23} />
        </span>
        <div>
          <h1>Driver Profile</h1>
          <p>Prototype account used for the final project demonstration.</p>
        </div>
      </div>

      <article className="profile-card">
        <div className="avatar" aria-hidden="true">
          AM
        </div>
        <div>
          <h2>Adnan Ellahi</h2>
          <p>Student ID: UC-0115</p>
          <p>Project: AI-Based Smart Parking Mobile Application</p>
        </div>
      </article>

      <div className="metrics-grid">
        {appMetrics.map((metric) => (
          <article key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </div>

      <div className="quality-list">
        <h2>Prototype Scope</h2>
        <p>
          The app uses sample data and a prediction model for demonstration. A real deployment would connect
          to parking sensors, payment providers, and transport authority APIs.
        </p>
        <span>
          <CheckCircle2 size={17} /> Tested prediction logic
        </span>
        <span>
          <ShieldCheck size={17} /> Accessible mobile controls
        </span>
        <span>
          <GraduationCap size={17} /> Report-ready architecture
        </span>
      </div>
    </section>
  );
}
