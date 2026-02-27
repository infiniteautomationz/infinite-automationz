import fs from 'fs/promises';
import path from 'path';

const PACKAGE_TO_PLAN: Record<string, string> = {
    'Digital Presence': 'bundle_digital_presence',
    'Operations & Scale': 'bundle_operations_scale',
    'Social Growth': 'bundle_social_growth',
};

const DIRECT_STRIPE_LINK_MAP: Record<string, string> = {
    // Legacy links
    'https://buy.stripe.com/9B6aEX16L7Lz9FHe8S0000a': '/api/checkout?plan=bundle_digital_presence',
    'https://buy.stripe.com/3cIcN52aPc1PbNP2qa0000b': '/api/checkout?plan=bundle_operations_scale',
    'https://buy.stripe.com/aFacN56r50j73hje8S0000c': '/api/checkout?plan=bundle_social_growth',
    // Current static-site links
    'https://buy.stripe.com/00w4gz4iXc1PdVXgh00000g': '/api/checkout?plan=bundle_digital_presence',
    'https://buy.stripe.com/4gM9AT9Dhfe1cRTc0K0000h': '/api/checkout?plan=bundle_operations_scale',
    'https://buy.stripe.com/28E9AT16L0j7bNPaWG0000i': '/api/checkout?plan=bundle_social_growth',
};

function hardenCheckoutButtons(html: string): string {
    let output = html;

    for (const [packageName, plan] of Object.entries(PACKAGE_TO_PLAN)) {
        const pattern = new RegExp(
            `<button[^>]*data-package="${packageName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}"[^>]*>([\\s\\S]*?)<\\/button>`,
            'gi',
        );

        output = output.replace(pattern, (_match, innerLabel) => {
            return `<a class="btn btn-primary stripe-checkout-btn" style="width:100%;display:inline-block;text-align:center;" href="/api/checkout?plan=${plan}">${innerLabel}</a>`;
        });
    }

    return output;
}

function normalizeMarketingHtml(rawHtml: string): string {
    const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let bodyContent = bodyMatch ? bodyMatch[1] : rawHtml;

    // Script tags injected via dangerouslySetInnerHTML do not execute in React,
    // so remove them to avoid implying functionality that won't run.
    bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    for (const [from, to] of Object.entries(DIRECT_STRIPE_LINK_MAP)) {
        bodyContent = bodyContent.replaceAll(from, to);
    }

    bodyContent = hardenCheckoutButtons(bodyContent);
    return bodyContent;
}

async function loadMarketingBody(): Promise<string> {
    const filePath = path.join(process.cwd(), 'public/index.html');
    const rawHtml = await fs.readFile(filePath, 'utf-8');
    return normalizeMarketingHtml(rawHtml);
}

export default async function MarketingPage() {
    try {
        const bodyContent = await loadMarketingBody();
        return <div dangerouslySetInnerHTML={{ __html: bodyContent }} suppressHydrationWarning />;
    } catch {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Failed to load marketing page.
            </div>
        );
    }
}
