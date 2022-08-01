export class dataTypes
{
    secs:number;
    time()
    {
        var fixedData = {
            'type': 'uptime',
            'hours': (this.secs > 3600 ? (Math.floor(this.secs / 3600)) : 0),
            'min': (this.secs > 60 ? (Math.floor(this.secs / 60)) : 0),
            "secs": this.secs
        }
        return JSON.stringify(fixedData);
    };

    connected()
    {
        var fixedData = {
            'type': 'connected',
        }
        return JSON.stringify(fixedData);
    };
}