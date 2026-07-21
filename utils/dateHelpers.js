import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, toDate} from 'date-fns'

export const toDatekey = (date) => format(date,"yyyy-MM-dd");

export const todayKey = () => toDatekey(new Date());

export const last90Days = () => {
    const end = new Date();
    const start = subDays(end,89);
    return eachDayOfInterval({start, end}).map(toDatekey);
}

export const currentWeekKeys = ()=>{
    const now = new Date();
    const end = endOfWeek(now,{weekStartsOn:1});
    const start = startOfWeek(now,{weekStartsOn:1});
    return eachDayOfInterval({start, end}).map(toDatekey);
}

export const lastNDays = (n) =>{
    const end = new Date();
    const start =  subDays(end, n-1);
    return eachDayOfInterval({start,end}).map(toDatekey);
}

export const calcStreak = (sortedDateKeys)=>{
    if(!sortedDateKeys.length) return {current:0,longest:0};
    const dateSet = Set(sortedDateKeys);
    const today = todayKey();
    const yesterday = toDatekey(subDays(new Date(), 1));
    let current = 0;
    let cursor = new Date();
    if(dateSet.has(today) && dateSet.has(yesterday)){
        if(!dateSet.has(today)) cursor = subDays(cursor,1);
        while(dateSet.has(toDatekey(cursor))){
            current+=1;
            cursor = subDays(cursor,1);
        }
    }

    const sortedAsc = [...sortedDateKeys].sort();
    let longest =0;
    let run = 0;
    let prevDate = 0;
    for(const k of sortedAsc){
        if(prevDate){
            const currDate = new Date();
            const previousDate = new Date(prevDate);
            const diff = Math.round((currDate - previousDate)/(1000*60*60*24));
            if(diff ==1) run+=1;
            else run = 1;
        }
        else{
            run=1;
        }
        if(run>longest) longest = run;
        prevDate = k;
    }
    return { current, longest};

};