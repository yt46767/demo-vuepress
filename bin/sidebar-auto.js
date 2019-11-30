const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
// 运行日志输出到根路径的文件logger.log
const logger = require("tracer").colorConsole({
	transport : function(data) {
		console.log(data.output);
		fs.appendFile('./logger.log', data.rawoutput + '\n', (err) => {
			if (err) throw err;
		});
	}
});
const docsRoot = path.join(__dirname, "../docs"); // __dirname: 指向被执行 js 文件的绝对路径
// 输出config-sidebar.js
const sidebarPath = path.join( __dirname, "../docs/.vuepress/config/sidebar.js" );
// 输出模板
const template = `
  <% for(let data of datas) { %>
    const <%- data.name %> = <%- JSON.stringify(data.childrens); %>
  <% } %>
  module.exports = {
    <% for (let data of datas) { %>
      "<%- data.path %>": <%- data.name %>,
    <% } %>
  }
`;

/**
 * 自执行主函数
 */
(function main() {
  const datas = [];
  // 读取docs文件夹下的一级文件夹目录(数组)
  const tocs = readTocs(docsRoot); 
  tocs.forEach(toc => {
    // 读取docs文件夹下的二级文件夹目录(数组)
    const toc1s = readTocs(toc);
    toc1s.forEach(toc1 => {
      // logger.log('toc1: '+toc1);
      // logger.log('prefix: '+`/${path.basename(toc)}/${path.basename(toc1)}/`);
      // 读取docs下的所有层级的文件夹并返回嵌套关系的数组，toc1：docs的二级绝对路径，prefix：一级文件名+二级文件名
      const childrens = mapTocToSidebar(toc1, `/${path.basename(toc)}/${path.basename(toc1)}/`);
      // 剔除掉空数组[]
      if (!childrens.length) return;
      // 排除.vuepress文件夹
      if(path.basename(toc) === '.vuepress') return;
      // "一级_二级"组成的数组
      datas.push({
        path: `/${path.basename(toc)}/${path.basename(toc1)}/`,
        name: path.basename(toc).split('_')[1] + '_' + path.basename(toc1).split('_')[1],
        childrens
      });
    });
  });

  fs.writeFileSync(sidebarPath, ejs.render(template, { datas }));
})()

/**
 * 读取指定路径下的目录（数组）
 * @param {String} root 文件(夹)的绝对路径
 */
function readTocs(root) {
  const result = [];
  // 同步返回文件数组列表（包含文件全名）
  const files = fs.readdirSync(root); //readdirSync：同步 readdir().返回文件数组列表（包含文件全名）
  files.forEach(file => {
    // root下一级目录的绝对路径
    const current_path = path.resolve(root, file);
    // 判断是否为文件夹
    if (fs.statSync(current_path).isDirectory()) { 
        // fs.stat(path, callback)：异步 stat() 回调函数有两个参数 err, stats，stats 是 fs.Stats 对象。 
        // fs.statSync(path)：同步 stat() 返回 fs.Stats 的实例
      result.push(current_path);
    }
  });
  return result;
}

/**
 * 将导航栏目录映射到对应的侧边栏配置
 * @param {String} root 文件(夹)的绝对路径
 * @param {String} prefix 前缀
 */
function mapTocToSidebar(root, prefix) {
  prefix = prefix || "";
  let sidebar = [];
  const files = fs.readdirSync(root);
  files.forEach((filename,index) => {
    const file = path.resolve(root, filename); // path.resolve()：将路径或路径片段的序列解析为绝对路径
    // order:序号，title:文件名，type:文件类型
    let order, title;
    if(filename.indexOf('_')>-1){
      [order, title] = filename.split("_"); 
    }else{
      title = filename; 
    }
    let type = filename.split('.')[1] || '';
    // order = parseInt(order, 10); // parseInt() 函数可解析一个字符串，并返回一个整数。10为解析的数字的基数。
    order = +order;
    // md文件排除return行列
    if ( type !== 'md' && (isNaN(order) || order < 0)) return;
    // 对元素存在时，会有日志警告
    if (sidebar[order]){} // logger.warn(`For ${file}, its order has appeared in the same level directory. And it will be rewritten.`);
    // 判断是否为文件夹
    if (fs.statSync(file).isDirectory()) { // stats.isDirectory()：如果是目录返回 true，否则返回 false。
      let child = mapTocToSidebar(file, prefix + filename + "/");
      if(child.length === 1 && child[0][1] === '简介'){
        child[0][1] = title;
        sidebar[order] = child.join(',').split(',');
      }else{
        sidebar[order] = {
          title,
          collapsable: false,
          children: child
        };
      }
    } else {
      // 文件类型进入下面流程
      if (type !== "md") return;
      if(filename.split('.')[0] === 'README'){
        let last = filename.lastIndexOf('/')-6;
        sidebar.push([prefix + filename.substr(0, last), '简介']); //没有顺序的文件，则在最后追加即可。误区：不要自定义序号加入队列某个位置，这样会误覆盖原来的元素。
      }else{
        // 加入元素格式为：[ 相对路径，文件名 ]
        sidebar.push([prefix + filename.split('.')[0], filename.split('.')[0]]);
      }
    }
  });
  sidebar = sidebar.filter(item => item !== null && item !== undefined);
  let hitIndex = sidebar.findIndex(item=>{
    return item[1] === '简介'
  });
  if(hitIndex > -1){
    let hitValue = sidebar[hitIndex];
    sidebar.splice(hitIndex,1);
    sidebar.unshift(hitValue);
  }
  return sidebar;
}