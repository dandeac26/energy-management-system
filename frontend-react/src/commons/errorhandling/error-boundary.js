import React, { useState } from 'react'

import styles from '../styles/project-style.css';

function ErrorBoundary(props) {
    const [hasError, setHasError] = useState(false);

    // componentDidCatch functionality does not have a hook yet
    // so we must use a try-catch block to replicate the same behavior
    try {
        if (hasError) {
            return <h1 className={styles.errorTitle}>An error occured at component level.</h1>;
        } else {
            return props.children;
        }
    } catch {
        setHasError((hasError) => (true));
    }
}

export default ErrorBoundary;
