
import { Context, Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/IContext";
import { data } from "../data/GetData";
import { getWeatherNow } from "../data/GetWeather";

let mainMethod:string;
export abstract class Command{
    constructor(public bot:Telegraf<IBotContext>){}
    abstract handle():void;
}

export class StartCommand extends Command{
    constructor(public bot:Telegraf<IBotContext>){
        super(bot)
    }

    handle(): void {
        this.bot.start( async (context)=>{
            console.log(context.session)
            await context.sendMessage("Привет, данный бот позволяет узнать погоду различными забавными способами, для начала выбери способ!");
            context.reply("Выбери способ!",Markup.inlineKeyboard([
                Markup.button.callback("На пиве","beer"),
                Markup.button.callback("На меме","meme"),
                Markup.button.callback("На милом животном","animal")
            ]))
            
        })
        this.bot.action("animal", async (context)=>{
            await context.sendMessage("вот тебе бонус")
            await context.sendAnimation("https://media.tenor.com/rV8mpdXgZpAAAAAd/i-show-speed-speed.gif")
        })
        this.bot.action("beer", (context)=>{
            context.session.Weather = true;
            context.reply("Как именно?",Markup.inlineKeyboard([
                Markup.button.callback("Светлое","light"),
                Markup.button.callback("Тёмное","dark"),
                Markup.button.callback("Изменить способ","change")
            ]))          
        })
        this.bot.action("light", async (context)=>{
            await context.sendMessage("вот тебе светлое пиво")
            await context.sendPhoto(data[getRandomInt(0,24)].get("beer"))
        })
        this.bot.action("dark", async (context)=>{
            await context.sendMessage("вот тебе тёмное пиво")
            await context.sendPhoto(data[getRandomInt(25,51)].get("beer"))
        })
    
        
        this.bot.action("meme", (context)=>{
            context.session.Weather = true;
            context.reply("Как именно?",Markup.inlineKeyboard([
                Markup.button.callback("Гифкой","gif"),
                Markup.button.callback("Картинкой","img"),
                Markup.button.callback("Анекдотом","joke"),
                Markup.button.callback("Изменить способ","change")
            ]))          
        })

        this.bot.action("change", (context)=>{
            context.session.Weather = false;
            context.reply("Выбери способ!",Markup.inlineKeyboard([
                Markup.button.callback("На пиве","beer"),
                Markup.button.callback("На меме","meme"),
                Markup.button.callback("На милом животном","animal")
            ]))
        })
        this.bot.action("gif",(context)=>{
            context.sendMessage("Напиши город, в котором хочешь узнать погоду в формате gif");
            checkMessage("gif");    
        })
        this.bot.action("img",(context)=>{
            context.sendMessage("Напиши город, в котором хочешь узнать погоду в формате мема");
            checkMessage("img");  
        })
        this.bot.action("joke",(context)=>{
            context.sendMessage("Напиши город, в котором хочешь узнать погоду в формате анекдота");
            checkMessage("joke");
        })
        let checkMessage = (method:string)=>{   
            changeMethod(method);      
                this.bot.on("text", async (context)=>{
                    console.log(mainMethod)
                    // if(mainMethod === "img"){
                    //     await context.replyWithPhoto("");
                    // }
                    // if(mainMethod === "gif") {
                    //     await context.replyWithAnimation("");
                    // }
                    // if(mainMethod === "joke"){
                    //     await context.sendMessage("");
                    // }
                    await context.sendMessage(await whatWeather(`${context.message.text}`,mainMethod));
                    context.reply("Ещё раз?",Markup.inlineKeyboard([
                        Markup.button.callback("Да, к выбору способа","change"),
                        Markup.button.callback("Да, но с новым городом","joke")
                    ]))
                })
        }
    }
}

const whatWeather = async (city:string,method:string):Promise<string>=>{
    let weather:any = await getWeatherNow(city);
    let main = weather.main
    return await`Город:${weather.name}\nСейчас: ${main.temp}°C\nОщущается как: ${main.feels_like}°C\nТемпература на сегодня:\nМаксимальная ${main.temp_max}°C минимальная: ${main.temp_min}°C\nОблачность ${weather.clouds.all}%`;
}
const changeMethod = (method:string):void=>{
    mainMethod = method;
}
function getRandomInt(min:number, max:number):number {
    min = min;
    max = max;
    return Math.floor(Math.random() * (max - min)) + min;
}