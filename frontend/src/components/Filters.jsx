import { useState, useEffect } from 'react';
import {
    Paper,
    TextField,
    Slider,
    Typography,
    Box,
    Autocomplete,
    Checkbox
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { getFilterOptions } from '../api/marketApi';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Filters = ({ filters, onFilterChange }) => {
    const [options, setOptions] = useState({ categories: [], skills: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const loadedOptions = await getFilterOptions();
                setOptions(loadedOptions);
            } catch (error) {
                console.error('Failed to load filter options:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadOptions();
    }, []);

    const handleSliderChange = (event, newValue) => {
        onFilterChange('experience_min', newValue);
    };

    const handleAutocompleteChange = (name, newValue) => {
        onFilterChange(name, newValue);
    };

    return (
        <Paper
            className="glass-paper"
            sx={{
                p: 3,
                mb: 4,
                width: '100%',
                position: 'relative',
                zIndex: 10
            }}
        >
            {/* Контейнер із гнучкою версткою */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                }}
            >
                {/* Категорія */}
                <Box sx={{ flexBasis: { xs: '100%', md: '45%' }, flexGrow: 1 }}>
                    <Autocomplete
                        fullWidth
                        options={options.categories}
                        value={filters.category || null}
                        onChange={(e, val) => handleAutocompleteChange('category', val)}
                        loading={isLoading}
                        getOptionLabel={(option) => option || ''}
                        renderInput={(params) => (
                            <TextField {...params} label="Категорія" fullWidth />
                        )}
                    />
                </Box>

                {/* Навички */}
                <Box sx={{ flexBasis: { xs: '100%', md: '45%' }, flexGrow: 1 }}>
                    <Autocomplete
                        fullWidth
                        multiple
                        disableCloseOnSelect
                        options={options.skills}
                        value={filters.skills || []}
                        onChange={(e, val) => handleAutocompleteChange('skills', val)}
                        loading={isLoading}
                        getOptionLabel={(option) => option || ''}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField {...params} label="Навички" fullWidth />
                        )}
                    />
                </Box>

                {/* Досвід */}
                <Box
                    sx={{
                        flexBasis: { xs: '100%', md: '100%' }, // тепер займає повну ширину ряду
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: 1
                    }}
                >
                    <Typography gutterBottom align="center" sx={{ mb: 1 }}>
                        Досвід (років)
                    </Typography>
                    <Slider
                        value={filters.experience_min || 0}
                        onChange={handleSliderChange}
                        step={1}
                        marks={[
                            { value: 0, label: '0' },
                            { value: 5, label: '5' },
                            { value: 10, label: '10' }
                        ]}
                        min={0}
                        max={10}
                        valueLabelDisplay="auto"
                        sx={{
                            width: '80%', // ← збільшує ширину слайдера
                            maxWidth: 600, // гарна пропорція для естетики
                        }}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default Filters;
