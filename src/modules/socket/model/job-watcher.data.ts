import { job_watchers } from "@prisma/client";
export class JobWatcherData {
    public id : string;
    public socket_id : string ; 
    public job_id : string ;

    constructor (watcher : job_watchers) {
        this.id = watcher.id ;
        this.socket_id = watcher.socket_id ; 
        this.job_id = watcher.job_id ;
    }
}