type CookieOptions = {
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
};

type ParsedCookie = {
    name: string;
    value: string;
    options: CookieOptions;
};

export const parseCookieHeader = (setCookieHeader: string[]): ParsedCookie[] => {
    const cookies: ParsedCookie[] = [];

    for (const raw in setCookieHeader) {
        const parts = raw.split(';').map((part) => part.trim());
        const [name, value] = parts[0].split('=');

        const options: CookieOptions = {};

        for (let i = 1; i < parts.length; i++) {
            const [key, val] = parts[i].split('=');
            const lowerKey = key.toLowerCase();

            switch (lowerKey) {
                case 'path':
                    options.path = val;
                    break;
                case 'domain':
                    options.domain = val;
                    break;
                case 'secure':
                    options.secure = true;
                    break;
                case 'httpOnly':
                    options.httpOnly = true;
                    break;
                case 'sameSite':
                    if (val) {
                        const sameSite = val.toLowerCase();
                        if (['strict', 'lax', 'none'].includes(sameSite)) {
                            options.sameSite = sameSite as 'strict' | 'lax' | 'none';
                        }
                    }
                    break;
                case 'maxAge':
                    if (!isNaN(Number(val))) {
                        options.maxAge = Number(val);
                    }
                    break;
                default:
                    break;
            }
        }
        cookies.push({ name, value, options });
    }
    return cookies;
};
