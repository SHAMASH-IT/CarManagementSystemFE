import React, { CSSProperties } from 'react';
import { Statistics, AppointmentReport } from '../types';

// Styles intégrés directement dans les composants
const styles: Record<string, CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  statsGrid: {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    marginBottom: '30px',
    overflowX: 'auto',
    padding: '10px 0',
  },
  statCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minWidth: '200px',
    flex: '1',
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  statIcon: {
    fontSize: '24px',
    marginRight: '10px',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  statSubtitle: {
    color: '#666',
    fontSize: '0.9rem',
  },
  appointmentsSection: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '20px',
  },
  tableHeader: {
    background: '#f5f5f5',
    padding: '12px',
    textAlign: 'left' as const,
    borderBottom: '2px solid #ddd',
  },
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  statusCompleted: {
    background: '#e6f4ea',
    color: '#1e7e34',
  },
  statusPending: {
    background: '#fff3cd',
    color: '#856404',
  },
  statusCancelled: {
    background: '#f8d7da',
    color: '#721c24',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    padding: '20px',
    margin: '20px',
    border: '1px solid #dc3545',
    borderRadius: '4px',
    background: '#f8d7da',
    color: '#721c24',
  },
};

// Composant pour afficher une carte de statistique
export const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
}> = ({ title, value, subtitle, icon }) => (
  <div style={styles.statCard}>
    <div style={styles.statHeader}>
      <span style={styles.statIcon}>{icon}</span>
      <h3>{title}</h3>
    </div>
    <div style={styles.statValue}>{value}</div>
    <div style={styles.statSubtitle}>{subtitle}</div>
  </div>
);

// Composant pour afficher les statistiques du prestataire
export const ProviderStats: React.FC<{ statistics: Statistics }> = ({ statistics }) => (
  <div style={styles.statsGrid}>
    <StatCard
      title="Clients"
      value={statistics.clientCount}
      subtitle="Clients servis"
      icon="👥"
    />
    <StatCard
      title="Véhicules"
      value={statistics.visibleVehicleCount}
      subtitle="Véhicules visibles"
      icon="🚗"
    />
    <StatCard
      title="Note moyenne"
      value={(statistics.providerAverageRates || 0).toFixed(1)}
      subtitle="Satisfaction client"
      icon="⭐"
    />
  </div>
);

// Composant pour afficher la liste des rendez-vous
export const AppointmentsList: React.FC<{ report: AppointmentReport }> = ({ report }) => {
  const performance = report.total > 0
    ? (report.completed / report.total) * 100
    : 0;

  return (
    <div style={styles.appointmentsSection}>
      <h2>Rendez-vous</h2>
      <div style={styles.statsGrid}>
        <StatCard
          title="Total"
          value={report.total}
          subtitle="Rendez-vous totaux"
          icon="📅"
        />
        <StatCard
          title="Complétés"
          value={report.completed}
          subtitle="Rendez-vous complétés"
          icon="✅"
        />
        <StatCard
          title="En attente"
          value={report.pending}
          subtitle="Rendez-vous en attente"
          icon="⏳"
        />
        <StatCard
          title="Annulés"
          value={report.cancelled}
          subtitle="Rendez-vous annulés"
          icon="❌"
        />
        <StatCard
          title="Performance"
          value={`${performance.toFixed(1)}%`}
          subtitle="Taux de complétion"
          icon="📈"
        />
      </div>
    </div>
  );
};

// Composant de chargement
export const LoadingSpinner: React.FC = () => (
  <div style={styles.loadingContainer}>
    <div style={styles.loadingSpinner} />
  </div>
);

// Composant d'erreur
export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div style={styles.errorContainer}>
    <p>{message}</p>
  </div>
); 