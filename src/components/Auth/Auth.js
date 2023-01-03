import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { AUTH } from '../../constants/actionTypes';

import Icon from './icon';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import { signIn, signUp } from '../../actions/auth';

const initialState = {firstName: '', lastName: '', email: '', password: '', confirmPassword: ''};

const Auth = () => {
    const classes = useStyles();
    const [ showPassword, setShowPassword ] = useState(false);
    const [ isSignUp, setIsSignUp ] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignUp){
            dispatch(signUp(formData, navigate));
        }
        else{
            dispatch(signIn(formData, navigate));
        }
    }

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    }

    const switchMode = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp);
        setShowPassword(false);
    }

    const googleSuccess = async (res) => {
        const token = res?.credential;
        const result = jwt_decode(token);

        try {
            dispatch({ type: AUTH, data: {result, token}});
            navigate('/');
        } catch (error) {
            console.log(error)
        }
    };

    const googleFailure = (error) => {
        console.log(error);
        console.log('Google sign in was unsuccessful. Try again later');
    };

    return (
        <GoogleOAuthProvider clientId='639228220006-6iriopbaa8ksem8vf52iuqdih05kstpk.apps.googleusercontent.com'>

            <Container component='main' maxWidth='xs'>
                <Paper className={classes.paper} elevation={3}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography variant='h5'>{isSignUp ? 'Sign up' : 'Sign in'}</Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {
                                isSignUp && (
                                    <>
                                        <Input name='firstName' label='First Name' handleChange={handleChange} autoFocus half />
                                        <Input name='lastName' label='Last Name' handleChange={handleChange} half />
                                    </>
                                )
                            }
                            <Input name='email' label='Email address' handleChange={handleChange} type='email' />
                            <Input name='password' label='Password' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                            { isSignUp && <Input name='confirmPassword' label='Repeat Password' handleChange={handleChange} type='password' />}
                        </Grid>
                        <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                            {isSignUp ? 'Sign up' : 'Sign in'}
                        </Button>
                        <Grid container justifyContent='center'>
                            <Grid item>
                                <GoogleLogin type='icon' shape='pill' logo_alignment='center' size='large'
                                    clientId='639228220006-6iriopbaa8ksem8vf52iuqdih05kstpk.apps.googleusercontent.com'
                                    render={(renderProps) => (
                                        <Button
                                            className={classes.googleButton} 
                                            color='primary' 
                                            fullWidth 
                                            onClick={renderProps.onClick} 
                                            disabled={renderProps.disabled} 
                                            startIcon={<Icon />} 
                                            variant='contained' 
                                        >
                                            Google Sign In
                                        </Button>
                                    )}
                                    onSuccess={googleSuccess}
                                    onFailure={googleFailure}
                                    cookiePolicy='single_host_origin'
                                />
                                </Grid>
                            </Grid>
                        <Grid container justify='center'>
                            <Grid item>
                                <Button onClick={switchMode}>
                                    {isSignUp ? 'Already have an account? Sign in' : 'Do not have an account? Sign up'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </GoogleOAuthProvider>
    )
}

export default Auth