const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const logger = require("tracer").colorConsole();
const docsRoot = path.join(__dirname, "..", "docs");
// 输出config-sidebar.js
const sidebarPath = path.join(
  __dirname,
  "..",
  "docs",
  ".vuepress",
  "config",
  "nav.js"
);
const template = `
module.exports = [
  <% for (let variable of variables) { %>
    <%- JSON.stringify(variable) %>,
  <% } %>
]
`;

main();

/**
 * 主体函数
 */
function main() {
  const variables = [];

  const tocs = readTocs(docsRoot); // 读取docs里的第一层文件夹，并返回文件夹名数组
  tocs.forEach(toc => {
    const js = mapTocToSidebar(toc); // 读取docs里的第二、三等层文件夹，并返回文件夹名数组
    if (!js.length) {
      return;
    }

    variables.push({
      text: path.basename(toc).split('_')[1],
      items: js
    });
  });

  fs.writeFileSync(sidebarPath, ejs.render(template, { variables }));
}

/**
 * 读取指定目录的文件夹作为不同的目录
 * @param {String} root
 */
function readTocs(root) {
  const result = [];
  const files = fs.readdirSync(root); //readdirSync：同步 readdir().返回文件数组列表。
  files.forEach(name => {
    const file = path.resolve(root, name);
    if (fs.statSync(file).isDirectory()) {
      result.push(file);
    }
  });
  return result;
}

/**
 * 将对应目录映射为对应的边栏配置
 * @param {String} root 
 * @param {String} prefix 前缀
 */
function mapTocToSidebar(root, prefix) {
  prefix = prefix || "";
  let sidebar = [];

  const files = fs.readdirSync(root);
  // logger.log(files);
  files.forEach((filename,index) => {
    const file = path.resolve(root, filename); // path.resolve()：将路径或路径片段的序列解析为绝对路径
    const stat = fs.statSync(file); 
    // fs.stat(path, callback)：异步 stat(). 回调函数有两个参数 err, stats，stats 是 fs.Stats 对象。
    // fs.statSync(path)：同步 stat().返回 fs.Stats 的实例
    let [order, title] = filename.split("_"); 
    let type = filename.split('.')[1];
    // order：序号
    // title：文件名
    // type：文件类型
    order = parseInt(order, 10);
    if (isNaN(order) || order < 0) {
      return;
    }

    if (sidebar[order]) {
      logger.warn(
        `For ${file}, its order has appeared in the same level directory. And it will be rewritten.`
      );
    }

    if (stat.isDirectory()) { // stats.isDirectory()：如果是目录返回 true，否则返回 false。
      sidebar[order] = { text: title, link: "/" + path.basename(root) + "/" + filename + "/"};
    }
  });

  sidebar = sidebar.filter(item => item !== null && item !== undefined);
  return sidebar;
}