// 每日任务成就数据：追加到成就列表
ACHIEVEMENTS.push(
{id:'daily1',icon:'📋',name:'任务达人',desc:'一天内完成所有每日任务',bonus:30,check:()=>{const d=lsGet('daily_tasks_data',null);if(!d)return false;const p=d.progress||{};let done=0;const tasks=['daily_play_game','daily_feed_pet','daily_clean_pet','daily_play_pet','daily_gacha','daily_checkin','daily_earn_coins','daily_pet_work','daily_pet_school','daily_use_tool'];const targets=[1,1,1,1,1,1,50,1,1,3];tasks.forEach((k,i)=>{if((p[k]||0)>=targets[i])done++;});return done>=10;}},
  {id:'daily2',icon:'🎁',name:'奖励收割机',desc:'累计领取每日任务奖励10次',bonus:35,check:()=>{const d=lsGet('daily_tasks_data',null);if(!d)return false;return(d.claimed||[]).length>=10;}}
);
