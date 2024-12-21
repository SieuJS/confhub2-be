export function stripHtmlContent(html: string): string {
    // Remove script and style tags and their content
    html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
    // Remove all HTML tags
    html = html.replace(/<[^>]+>/g, '');
  
    // Remove extra whitespaces
    html = html.replace(/\s+/g, ' ').trim();
  
    return html;
  }
  