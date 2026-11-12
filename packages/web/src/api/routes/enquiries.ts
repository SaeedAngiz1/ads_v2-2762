import {z} from 'zod';
import {ORPCError} from '@orpc/server';
import {base} from '../__core/app';
import {db} from '../database';
import {enquiries as table} from '../database/schema';
const limits=new Map<string,number[]>();
export const enquiries={submit:base.input(z.object({kind:z.enum(['contact','application']),name:z.string().trim().min(2).max(200),email:z.string().email().max(254),company:z.string().max(200).optional(),message:z.string().trim().min(5).max(10000),stage:z.string().max(500).optional(),role:z.string().max(200).optional(),portfolio:z.string().max(2000).optional(),features:z.array(z.string().max(100)).max(30).optional(),attachment:z.object({name:z.string().max(255),type:z.string().max(100),data:z.string().max(2800000)}).optional(),website:z.string().max(200).optional()})).handler(async({input})=>{
 if(input.website)throw new ORPCError('BAD_REQUEST',{message:'Unable to submit this form.'});
 const now=Date.now(),recent=(limits.get(input.email)||[]).filter(t=>now-t<3600000);if(recent.length>=5)throw new ORPCError('TOO_MANY_REQUESTS',{message:'Too many submissions. Please try again later.'});
 const id=crypto.randomUUID();await db.insert(table).values({id,kind:input.kind,name:input.name,email:input.email,company:input.company||null,message:input.message,details:JSON.stringify({stage:input.stage,role:input.role,portfolio:input.portfolio,features:input.features,attachment:input.attachment})});limits.set(input.email,[...recent,now]);return {id,saved:true,sentToPhantom:false};
})};
