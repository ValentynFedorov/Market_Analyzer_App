import { useState, useEffect } from 'react';
import { getDemandData } from '../api/marketApi';
import { useApiData } from '../hooks/useApiData';
import PageContainer from '../components/PageContainer';
import Chart from '../components/Chart';
import Filters from '../components/Filters';
import { CircularProgress, Alert, Typography, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const DemandPage = () => {
    const [filters, setFilters] = useState({ category: 'Python', experience_min: 1 , skills: [],});
    const { data, loading, error, fetchData } = useApiData(getDemandData);

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
            <Typography variant="h4" gutterBottom>Аналіз пропозиції</Typography>
            <Filters filters={filters} onFilterChange={handleFilterChange} />

            {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}
            {error && <Alert severity="error">Помилка: {error.response?.data?.detail || error.message}</Alert>}

            {data && (
                <Grid container spacing={4} direction="column">

                    {/* Прогноз попиту */}
                    {data.demand_forecast && (
                        <Grid item xs={12} component={motion.div} variants={itemVariants} initial="hidden" animate="visible">
                            <Paper className="glass-paper" sx={{ p: 2, minHeight: 450 }}>
                                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                                    Прогноз попиту для "{filters.category}"
                                </Typography>
                                <Chart
                                    data={[
                                        { x: data.demand_forecast.dates, y: data.demand_forecast.confidence_upper, fill: 'tonexty', fillcolor: 'rgba(144, 202, 249, 0.2)', line: { color: 'transparent' }, name: 'Довірчий інтервал', showlegend: false },
                                        { x: data.demand_forecast.dates, y: data.demand_forecast.confidence_lower, line: { color: 'transparent' }, name: 'Довірчий інтервал', showlegend: false },
                                        { x: data.demand_forecast.historical_dates, y: data.demand_forecast.historical_demand, mode: 'lines', name: 'Історія', line: { color: 'grey' } },
                                        { x: data.demand_forecast.dates, y: data.demand_forecast.predicted_demand, mode: 'lines', name: 'Прогноз', line: { color: '#90caf9', width: 3 } },
                                    ]}
                                    layout={{ title: 'Динаміка та прогноз кількості вакансій' }}
                                />
                            </Paper>
                        </Grid>
                    )}

                    {/* Розподіл по досвіду */}
                    {data.experience_distribution && data.experience_distribution.length > 0 && (
                        <Grid item xs={12} component={motion.div} variants={itemVariants} initial="hidden" animate="visible">
                            <Paper className="glass-paper" sx={{ p: 2, minHeight: 450 }}>
                                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>Розподіл по досвіду</Typography>
                                <Chart
                                    data={[{
                                        values: data.experience_distribution.map(d => d.count),
                                        labels: data.experience_distribution.map(d => `${d.experience} р.`),
                                        type: 'pie',
                                        hole: .4,
                                        textinfo: "label+percent",
                                        automargin: true
                                    }]}
                                    layout={{ title: 'Частка вакансій у відфільтрованому сегменті', showlegend: false }}
                                />
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            )}
        </PageContainer>
    );
};

export default DemandPage;