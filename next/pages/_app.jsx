import BackProvider from '../context/BackProvider';
import '../styles.css';

export default function App({ Component, pageProps }) {
    return (
        <BackProvider>
            <Component {...pageProps} />
        </BackProvider>
    )
}
