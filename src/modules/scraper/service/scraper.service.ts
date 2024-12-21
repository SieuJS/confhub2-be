import { Injectable } from '@nestjs/common';
import * as playwright from 'playwright';
import { Page, BrowserContext } from 'playwright';
import { stripHtmlContent } from '../util';
interface Conference {
    Title: string;
    Acronym: string;
  }
@Injectable()
export class ScraperService {
    private unwantedDomains = [
        'scholar.google.com',
        'translate.google.com',
        'google.com',
        'wikicfp.com',
        'dblp.org',
        'medium.com',
        'dl.acm.org',
        'easychair.org',
        'youtube.com',
        'https://portal.core.edu.au/conf-ranks/',
        'facebook.com',
        'amazon.com',
        'wikipedia.org',
        'linkedin.com',
        'springer.com',
        'proceedings.com',
        'semanticscholar.org',
        'myhuiban.com',
        'scholat.com',
        '10times.com',
        'x.com',
        'instagram.com',
        'hotcrp.com',
        'scitepress.org',
        'portal.insticc.org',
        'galaxybookshop.com',
        'call4paper.com',
        'twitter.com',
        'facebook.com',
        'dl.acm.org',
        'www.researchgate.net',
        'aconf.org',
      ];

    private maxLink = 4; 
    
    public async searchConferenceLinks(
        browserContext: BrowserContext,
        conference: Conference,
      ): Promise<string[]> {
        const maxLinks = this.maxLink;
        const links: string[] = [];
        const page: Page = await browserContext.newPage();
    
        let timeout: NodeJS.Timeout | undefined;
    
        try {
          timeout = setTimeout(() => {
            page.close();
          }, 60000); // 60 seconds
    
          await page.goto('https://www.google.com/', { waitUntil: 'load', timeout: 60000 });
    
          await page.waitForSelector('#APjFqb', { timeout: 30000 });
          const text = conference.Title.replace(/\s*\([^)]*\)/g, ''); // Remove text within parentheses and extra spaces
          await page.fill('#APjFqb', `${text} (${conference.Acronym}) conference 2024 or 2025`);
          await page.press('#APjFqb', 'Enter');
          await page.waitForSelector('#search');
    
          while (links.length < maxLinks) {
            const newLinks = await page.$$eval('#search a', (elements) => {
              return elements
                .map((el: any) => el.href)
                .filter((href) => href && href.startsWith('https://'));
            });
    
            newLinks.forEach((link) => {
              if (
                !links.includes(link) &&
                !this.unwantedDomains.some((domain) => link.includes(domain)) &&
                !/book|product/i.test(link) && // Skip if the link contains "book" or "product"
                links.length < maxLinks
              ) {
                links.push(link);
              }
            });
    
            if (links.length < maxLinks) {
              await page.keyboard.press('PageDown');
              await page.waitForTimeout(2000);
            } else {
              break;
            }
          }
        } catch (error) {
          console.error(`Error while searching for conference links: ${error.message}`);
        } finally {
          if (timeout) clearTimeout(timeout);
          await page.close();
        }
    
        return links.slice(0, maxLinks);
      }
    
      async searchConferences(title: string, acronym: string): Promise<{ link: string; htmlContent: string }[]> {
        const browser = await playwright.chromium.launch();
        const context = await browser.newContext();
    
        const conference: Conference = { Title: title, Acronym: acronym };
        const links = await this.searchConferenceLinks(context, conference);
    
        const results: { link: string; htmlContent: string }[] = [];
    
        for (const link of links) {
          try {
            const page = await context.newPage();
            await page.goto(link);
            const htmlContent = await page.content();
            const strippedContent = stripHtmlContent(htmlContent);
            results.push({ link, htmlContent : strippedContent });
            await page.close();
          } catch (error) {
            console.error(`Failed to fetch content for ${link}:`, error);
          }
        }
        await browser.close();
        return results;
      }
    }