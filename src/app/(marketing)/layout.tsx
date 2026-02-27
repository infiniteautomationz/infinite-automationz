import './marketing.css';
import Script from 'next/script';

export const metadata = {
    title: 'Infinite Automationz — AI Automation That Actually Works for Huntsville Businesses',
    description: 'Engineer-built AI automation for Huntsville/Madison businesses. 24/7 AI receptionists, lead generation, social media automation. 30-day money-back guarantee. From $249/month.',
};

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500&f[]=general-sans@500,600,700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

            {children}

            <Script src="https://js.stripe.com/v3/" strategy="lazyOnload" />
            <Script type="module" src="https://unpkg.com/@splinetool/viewer@1.12.58/build/spline-viewer.js" strategy="lazyOnload" />
        </>
    );
}
