import React from "react";
import Grid from "@mui/material/Grid";
import './header.css';

function Header() {

    const SideItem = () => {
        return (
            <div className="Side-item"/>
        )}

    const CentralItem = () => {
        return (
            <div className="CentralItem"/>
        )}

    return (
            <Grid container direction="row"
                  justifyContent="space-between">
                <Grid item xs={1.5}>
                    <SideItem>

                    </SideItem>
                </Grid>
                <Grid item xs={8}>
                    <CentralItem>

                    </CentralItem>
                </Grid>
                <Grid item xs={1.5}>
                    <SideItem>

                    </SideItem>
                </Grid>
            </Grid>
    );

}

export default Header;