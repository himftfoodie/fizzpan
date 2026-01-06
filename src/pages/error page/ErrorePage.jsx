
import React from 'react'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Grid from "@mui/material/Grid";

export default function ErrorePage() {
    return (
        <main style={{ marginTop: 200, textAlign: "center", fontSize: 20, fontWeight: 'bold', color: 'red' }}>

            <Grid >
                <SentimentVeryDissatisfiedIcon />
            </Grid>
            <h1>404 - Page Not Found</h1>
            <p>Yah ga nemu halaman.</p>
        </main>
    )
}
