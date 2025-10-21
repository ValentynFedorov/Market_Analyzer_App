import { useState, useEffect } from 'react';
import { getSkillsData } from '../api/marketApi';
import { useApiData } from '../hooks/useApiData';
import PageContainer from '../components/PageContainer';
import Chart from '../components/Chart';
import Filters from '../components/Filters';
import { CircularProgress, Alert, Typography, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
};

const SkillsPage = () => {
    const [filters, setFilters] = useState({ category: 'Python', experience_min: 3 });
    const { data, loading, error, fetchData } = useApiData(getSkillsData);

    useEffect(() => {
        if (filters.category) {
            fetchData(filters);
        }
    }, [filters, fetchData]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value === '' ? undefined : value }));
    };

    return (
        <PageContainer>
            <Typography variant="h4" gutterBottom>Аналіз ключових навичок</Typography>
            <Filters filters={filters} onFilterChange={handleFilterChange} />

            {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}
            {error && <Alert severity="error">Помилка: {error.response?.data?.detail || error.message}</Alert>}

            {data && (
                <Grid container spacing={4} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
                    <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
                        <Paper className="glass-paper" sx={{ p: 2, height: '500px' }}>
                            <Typography variant="h5" gutterBottom>Найважливіші навички (вплив на ЗП)</Typography>
                            <Chart
                                data={[{
                                    y: data.skill_importance.skill_importance_for_salary.map(s => s.skill),
                                    x: data.skill_importance.skill_importance_for_salary.map(s => s.importance),
                                    type: 'bar',
                                    orientation: 'h',
                                    marker: { color: '#90caf9' }
                                }]}
                                layout={{ title: 'Важливість (ML)', yaxis: { autorange: 'reversed' } }}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
                        <Paper className="glass-paper" sx={{ p: 2, height: '500px' }}>
                            <Typography variant="h5" gutterBottom>Топ навички для Q4 (Top 25% ЗП)</Typography>
                            <Chart
                                data={[{
                                    y: data.top_skills_by_quartile['Q4 (Top)'].map(s => s.skills),
                                    x: data.top_skills_by_quartile['Q4 (Top)'].map(s => s.count),
                                    type: 'bar',
                                    orientation: 'h',
                                    marker: { color: '#e3f2fd' }
                                }]}
                                layout={{ title: 'Найчастіші згадки', yaxis: { autorange: 'reversed' } }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </PageContainer>
    );
};

export default SkillsPage;