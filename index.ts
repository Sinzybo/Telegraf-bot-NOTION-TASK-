import {  Telegraf } from "telegraf";
import { createNotionTask } from "./utils";
import { env } from "bun";

const bot = new Telegraf('Your_BOT_TOKEN');
bot.start(  (ctx) => {
   ctx.reply('create task with /ncreate [name], [Priority Level]')
  console.log('started bot')
})

bot.command('ncreate', async (ctx) => {
    const taskNameInput = ctx.message.text.split(' ')[1];
    type Priority = "High" | "Low" | "Medium" | undefined
    const PriorityLevel = ctx.message.text.split(' ')[2].toLowerCase() as Priority;
    if(!["high", "low", "medium", undefined].includes(PriorityLevel)) {
      ctx.reply("Priority level can only be: High, Low, Medium")
      return;
    }
    //as gives type to const. 
 
  
    if(PriorityLevel && taskNameInput) { 
      ctx.reply(`Created task with the name of: ${taskNameInput}, and priority level of: ${PriorityLevel}`);
    } else if(PriorityLevel && !taskNameInput) {
      ctx.reply('Name of the project? (/ncreate [name] [Priority Level]')
    } else if(!PriorityLevel && taskNameInput) {
      ctx.reply('You need to give priority level to project. (/ncreate [Name] [Priority Level])')
    } else if(!PriorityLevel && !taskNameInput) {
      ctx.reply('/ncreate [Name] [Priority Level]')
    }
    await createNotionTask('databaseID', {
      taskName: taskNameInput,
      priority: PriorityLevel
    })

});

bot.launch().then((() => {
  console.log('bot is running')
})).catch((err) => {
  console.error('Error with starting bot', err)
});
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));