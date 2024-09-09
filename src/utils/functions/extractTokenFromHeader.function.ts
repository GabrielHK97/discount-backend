export function extractTokenFromHeader(cookies: string): string {
    return cookies ? cookies
      .split(';')
      .filter((cookie) => {
        return cookie.includes('token');
      })[0]
      .split('=')[1] : undefined;
  }