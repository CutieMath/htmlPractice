import React from 'react';

function Footer(){

    // to get current year
    const currentYear = new Date().getFullYear();

    return(
        <footer>
            <p>{currentYear} &#169; Made with &#10084; by Cutie Math</p>
        </footer>
    )
}

export default Footer;