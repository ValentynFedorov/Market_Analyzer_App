// src/pages/SalaryPage.jsx

import { useState, useEffect } from 'react';
import { getSalaryData } from '../api/marketApi';
import { useApiData } from '../hooks/useApiData';
import PageContainer from '../components/PageContainer';
import Chart from '../components/Chart';
import Filters from '../components/Filters';
import { CircularProgress, Alert, Typography, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';

// Анімація для появи елементів
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const SalaryPage = () => {
    const [filters, setFilters] = useState({ category: 'JavaScript', experience_min: 0, forecast_days: 365 });
    const { data, loading, error, fetchData } = useApiData(getSalaryData);

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
            <Typography variant="h4" gutterBottom>Аналіз та прогноз зарплат</Typography>

            <Filters filters={filters} onFilterChange={handleFilterChange} />

            {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}
            {error && <Alert severity="error">Помилка: {error.response?.data?.detail || error.message}</Alert>}

            {data && (
                // ✅ ОСНОВНЕ ВИПРАВЛЕННЯ ТУТ:
                // Тепер кожен Grid item займає всю ширину (xs={12})
                <Grid container spacing={4} direction="column">
                    {/* Прогноз попиту */}
                    <Grid item xs={12} component={motion.div} variants={itemVariants} initial="hidden" animate="visible">
                        <Paper className="glass-paper" sx={{ p: 2, height: '500px' }}>
                            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>Прогноз попиту</Typography>
                            <Chart
                                data={[
                                    { x: data.demand_forecast.dates, y: data.demand_forecast.confidence_upper, fill: 'tonexty', fillcolor: 'rgba(144, 202, 249, 0.2)', line: { color: 'transparent' }, name: 'Confidence', showlegend: false },
                                    { x: data.demand_forecast.dates, y: data.demand_forecast.confidence_lower, line: { color: 'transparent' }, name: 'Confidence', showlegend: false },
                                    { x: data.demand_forecast.historical_dates, y: data.demand_forecast.historical_demand, mode: 'lines', name: 'Історія', line: { color: 'grey' } },
                                    { x: data.demand_forecast.dates, y: data.demand_forecast.predicted_demand, mode: 'lines', name: 'Прогноз', line: { color: '#90caf9', width: 3 } },
                                ]}
                                layout={{ title: `Прогноз для "${filters.category}"` }}
                            />
                        </Paper>
                    </Grid>

                    {/* Зарплата vs Досвід */}
                    <Grid item xs={12} component={motion.div} variants={itemVariants} initial="hidden" animate="visible">
                        <Paper className="glass-paper" sx={{ p: 2, height: '450px' }}>
                            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>Зарплата vs Досвід</Typography>
                            <Chart
                                data={[{
                                    x: data.salary_distribution.by_experience.map(d => d.experience),
                                    y: data.salary_distribution.by_experience.map(d => d.avg_salary),
                                    type: 'bar',
                                    marker: { color: '#90caf9' }
                                }]}
                                layout={{ title: 'Медіанна зарплата ($)', xaxis: { title: 'Роки досвіду' } }}
                            />
                        </Paper>
                    </Grid>

                    {/* Розподіл по квартилям */}
                    <Grid item xs={12} component={motion.div} variants={itemVariants} initial="hidden" animate="visible">
                        <Paper className="glass-paper" sx={{ p: 2, height: '450px' }}>
                            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>Розподіл по квартилям</Typography>
                            <Chart
                                data={[{
                                    x: data.salary_distribution.by_quartile.map(d => d.salary_quartile),
                                    y: data.salary_distribution.by_quartile.map(d => d.median),
                                    type: 'bar',
                                    marker: { color: ['#424242', '#616161', '#90caf9', '#e3f2fd'] }
                                }]}
                                layout={{ title: 'Медіанна зарплата ($)', yaxis: { title: 'Зарплата ($)' } }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </PageContainer>
    );
};

export default SalaryPage;