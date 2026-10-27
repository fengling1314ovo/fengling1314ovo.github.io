// 打工成就数据：追加到成就列表
ACHIEVEMENTS.push(
{id:'work1',icon:'💼',name:'初入职场',desc:'首次让小橘打工',bonus:15,check:()=>{const c=lsGet('pet_work_counts',{});return Object.keys(c).length>0;}},
  {id:'work2',icon:'🏢',name:'打工人',desc:'累计打工10次',bonus:30,check:()=>{const c=lsGet('pet_work_counts',{});let t=0;for(let k in c)t+=c[k];return t>=10;}},
  {id:'work3',icon:'💰',name:'打工皇帝',desc:'打工累计赚取500金币',bonus:50,check:()=>(lsGet('pet_work_total_earned',0)||0)>=500},
  {id:'work4',icon:'🌟',name:'全能打工人',desc:'尝试过所有6种工作',bonus:66,check:()=>{const c=lsGet('pet_work_counts',{});return Object.keys(c).length>=6;}},
  {id:'work5',icon:'👨‍💻',name:'程序员之路',desc:'成为程序员打工5次',bonus:40,check:()=>(lsGet('pet_work_counts',{}).programmer||0)>=5}
);
