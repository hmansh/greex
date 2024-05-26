import React from 'react';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import Colors from '@/themes/colors';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';

interface HeaderProps { };

const Header: React.FC<HeaderProps> = () => {
    const { data } = useSession();
    const router = useRouter();

    const handleLogin = () => {
        router.push('/api/auth/signin');
    }

    const handleLogout = () => {
        router.push('/api/auth/signout');
    }

    return (
        <AppBar sx={{ bgcolor: Colors.primary600 }} position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    GreeX
                </Typography>
                {data && <Avatar>{(data.user?.name ?? '').slice(0, 1)}</Avatar>}
                <Button onClick={data ? handleLogout : handleLogin} color='inherit'>
                    {data ? 'Logout' : 'Login'}
                </Button>
            </Toolbar>
        </AppBar>
    )
};

export default Header;