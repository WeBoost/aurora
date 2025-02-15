import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../../../../hooks/useAuth';
import { useBusiness } from '../../../../../hooks/useBusiness';
import { useWebsiteContent } from '../../../../../hooks/useWebsiteContent';

export default function WebsiteRenderer() {
  const params = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const { business } = useBusiness(session?.user?.id);
  const { sections } = useWebsiteContent(business?.id);
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (sections) {
      const generatedHtml = generateWebsite(sections, business);
      setHtml(generatedHtml);
    }
  }, [sections, business]);

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
      />
    </View>
  );
}

function generateWebsite(sections: any[], business: any) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${business?.name || 'Website'}</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
        }
      </style>
    </head>
    <body>
      ${sections.map(section => renderSection(section)).join('')}
      
      <script>
        // Basic interactivity
        document.addEventListener('DOMContentLoaded', function() {
          // Add smooth scrolling
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
              e.preventDefault();
              document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
              });
            });
          });
        });
      </script>
    </body>
    </html>
  `;
}

function renderSection(section: any) {
  switch (section.type) {
    case 'hero':
      return `
        <section class="relative min-h-screen flex items-center justify-center text-white py-20 px-4"
                style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${section.content.backgroundImage || 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2850&q=80'}') no-repeat center center; background-size: cover;">
          <div class="text-center max-w-4xl mx-auto">
            <h1 class="text-5xl md:text-6xl font-bold mb-6">${section.content.heading}</h1>
            <p class="text-xl md:text-2xl mb-8 opacity-90">${section.content.subheading}</p>
            ${section.content.cta ? `
              <a href="${section.content.cta.url}" 
                 class="inline-flex items-center px-8 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors">
                ${section.content.cta.text}
              </a>
            ` : ''}
          </div>
        </section>
      `;

    case 'features':
      return `
        <section class="py-20 px-4 bg-white">
          <div class="max-w-6xl mx-auto">
            <h2 class="text-4xl font-bold text-center mb-12">${section.content.title}</h2>
            <div class="grid md:grid-cols-3 gap-8">
              ${(section.content.features || []).map((feature: any) => `
                <div class="p-6 rounded-lg bg-gray-50">
                  <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold mb-2">${feature.title}</h3>
                  <p class="text-gray-600">${feature.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;

    case 'contact':
      return `
        <section class="py-20 px-4 bg-gray-50">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-4xl font-bold text-center mb-12">${section.content.title}</h2>
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <form class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Message</label>
                    <textarea rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"></textarea>
                  </div>
                  <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                    Send Message
                  </button>
                </form>
              </div>
              <div class="space-y-4">
                ${section.content.email ? `
                  <div class="flex items-center">
                    <svg class="w-6 h-6 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span>${section.content.email}</span>
                  </div>
                ` : ''}
                ${section.content.phone ? `
                  <div class="flex items-center">
                    <svg class="w-6 h-6 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span>${section.content.phone}</span>
                  </div>
                ` : ''}
                ${section.content.address ? `
                  <div class="flex items-center">
                    <svg class="w-6 h-6 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>${section.content.address}</span>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </section>
      `;

    default:
      return '';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webview: {
    flex: 1,
  },
});