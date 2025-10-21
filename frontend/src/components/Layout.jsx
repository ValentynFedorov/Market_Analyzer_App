import { NavLink, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';

const activeLinkStyle = {
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
    color: 'white',
};

const Layout = () => (
    <Box>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    IT Market Analytics
                </Typography>
                <nav>
                    <Button component={NavLink} to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} color="inherit">
                        Пропозиція
                    </Button>
                    <Button component={NavLink} to="/salary" style={({ isActive }) => isActive ? activeLinkStyle : undefined} color="inherit">
                        Зарплата
                    </Button>
                    <Button component={NavLink} to="/skills" style={({ isActive }) => isActive ? activeLinkStyle : undefined} color="inherit">
                        Навички
                    </Button>
                </nav>
            </Toolbar>
        </AppBar>
        <Container component="main" sx={{ mt: 4, mb: 4 }}>
            <Outlet />
        </Container>
    </Box>
);

export default Layout;