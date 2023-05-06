import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'cc',
    nav: [
      { title: '快速开始', link: '/guide' },
      { title: '组件', link: '/components/common-table' },
    ],
    socialLinks: {
      github: 'https://github.com/easy261925',
    },
  },
});
