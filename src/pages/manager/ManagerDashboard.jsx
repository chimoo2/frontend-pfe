import React, { useState, useEffect } from 'react';
import { Box, Grid, Fab } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AlarmIcon from '@mui/icons-material/Alarm';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import StatCard from '../../components/dashboard/StatCard';
import GrowthChart from '../../components/dashboard/GrowthChart';
import PopularList from '../../components/dashboard/PopularList';
import StatusDonut from '../../components/dashboard/StatusDonut';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { getProjectsByManager } from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
// removed date-fns to avoid missing dependency; use native Date for simple formatting

export default function ManagerDashboard() {
  // project state and statistics
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inprogress: 0, completed: 0, overdue: 0, dueSoon: 0 });
  const [monthlySeries, setMonthlySeries] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!user?.email) return;

      try {
        const list = await getProjectsByManager(user.email);
        setProjects(list);
        // compute counts
        const today = new Date();
        const counts = { total: list.length, todo: 0, inprogress: 0, completed: 0, overdue: 0, dueSoon: 0 };
        const monthly = {}; // key=month, value=count
        list.forEach(p => {
          const st = (p.status || '').toLowerCase();
          if (st.includes('progress')) counts.inprogress++;
          else if (st.includes('complete') || st.includes('done')) counts.completed++;
          else counts.todo++;

          // deadlines
          if (p.endDate) {
            const end = new Date(p.endDate);
            if (end < today && !st.includes('complete')) {
              counts.overdue++;
            } else if (end >= today && end <= new Date(today.getTime() + 30*24*60*60*1000)) {
              counts.dueSoon++;
            }
          }

          if (p.startDate) {
            const monthIndex = new Date(p.startDate).getMonth();
            monthly[monthIndex] = (monthly[monthIndex] || 0) + 1;
          }
        });

        // compute top skills used across projects
        const skillCounts = {};
        list.forEach(p => {
          (p.requiredSkills || []).forEach(s => {
            const skillName = s.skillName || s.skill || 'Inconnu';
            skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
          });
        });
        const topSkills = Object.entries(skillCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([name, count]) => ({
            name,
            value: `${count} fois`,
            note: `${count} demande${count > 1 ? 's' : ''}`,
            positive: true
          }));

        setStats(counts);
        // build series ordered by months (fr-FR short month names)
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        setMonthlySeries([{ name: 'Projets', data: monthNames.map((_, index) => monthly[index] || 0) }]);
        setTopSkills(topSkills);
      } catch (e) {
        console.error('Failed loading projects for dashboard', e);
      }
    };
    load();
  }, [user?.email]);

  return (
    <Box sx={{ bgcolor: '#f4f7fb', minHeight: '100vh', position: 'relative' }}>
      <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto', mt: 2 }}>
        {/* header section with greeting and quick actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2, p: 3, bgcolor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 48, color: '#7c3aed' }} />
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: 800, color: '#111827', letterSpacing: '-0.6px' }}>
                Bonjour, {user?.prenom || user?.nom || 'Manager'}
              </h2>
              <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>Bienvenue sur votre tableau de bord professionnel - surveillez vos indicateurs clés et prenez des décisions éclairées.</div>
            </div>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" startIcon={<DownloadIcon />} sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, borderRadius: '10px', fontWeight: 700, textTransform: 'none', boxShadow: '0 8px 16px rgba(37,99,235,0.12)' }}>
              Télécharger rapport
            </Button>
            <Button variant="outlined" startIcon={<AccountBalanceWalletIcon />} sx={{ borderRadius: '10px', fontWeight: 700, textTransform: 'none' }}>
              Nouveau projet
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2} alignItems="stretch">
          {/* KPI cards */}
          <Grid item xs={12} md={3}>
            <StatCard
              title="Projets totaux"
              value={stats.total}
              subtitle="depuis toujours"
              icon={AccountBalanceWalletIcon}
              sx={{ background: 'linear-gradient(90deg,#6d28d9,#8b5cf6)', color: '#fff', boxShadow: '0 12px 34px rgba(13,49,133,0.08)' }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="En cours"
              value={stats.inprogress}
              subtitle="maintenant"
              icon={ShoppingBagIcon}
              sx={{ background: 'linear-gradient(90deg,#0284c7,#60a5fa)', color: '#fff', boxShadow: '0 12px 34px rgba(3,105,161,0.06)' }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="Terminés"
              value={stats.completed}
              icon={MonetizationOnIcon}
              sx={{ boxShadow: '0 8px 20px rgba(16,24,40,0.04)', bgcolor: '#ffffff' }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="En retard"
              value={stats.overdue}
              subtitle="dates dépassées"
              icon={AlarmIcon}
              sx={{ background: 'linear-gradient(90deg,#dc2626,#f87171)', color: '#fff', boxShadow: '0 12px 34px rgba(220,38,38,0.1)' }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <StatusDonut data={stats} />
          </Grid>
          <Grid item xs={12} md={4}>
            <GrowthChart
              title="Projets démarrés par mois"
              value={`${stats.total} totaux`}
              categories={['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc']}
              series={monthlySeries}
              legendItems={[{ name: 'Projets', color: '#7c3aed' }]}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularList title="Compétences les plus demandées" items={topSkills} />
          </Grid>

        </Grid>

        {/* explanatory footer text */}
        <Box sx={{ mt: 4, textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
          <em>Les données sont mises à jour automatiquement à partir de vos projets. Cliquez sur « Nouveau projet » pour démarrer.</em>
        </Box>
      </Box>
      <Fab color="primary" sx={{ position: 'fixed', right: 28, bottom: 84, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, boxShadow: '0 12px 30px rgba(124,58,237,0.18)' }} aria-label="settings">
        <SettingsIcon />
      </Fab>
    </Box>
  );
}