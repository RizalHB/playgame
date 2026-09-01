interface Props {
  installation: {
    status:string;
    currentOperation:string|null;
    downloadProgress:number;
    downloadSpeedMbps:number;
    remainingSeconds:number;
  };
}


export function ActiveDownloadCard({
  installation,
}:Props){

return (
<div
className="
rounded-2xl
border
border-zinc-800
bg-zinc-900
p-6
"
>

<h2 className="text-xl font-bold">
Download
</h2>


<p className="mt-2 text-zinc-400">
{installation.currentOperation}
</p>


<div
className="
mt-5
h-3
overflow-hidden
rounded-full
bg-zinc-800
"
>

<div
className="
h-full
bg-blue-500
transition-all
"
style={{
width:
`${installation.downloadProgress}%`
}}
/>

</div>


<div className="
mt-3
flex
justify-between
text-sm
text-zinc-400
">

<span>
{installation.downloadProgress}%
</span>


<span>
{installation.downloadSpeedMbps} Mbps
</span>


<span>
ETA {installation.remainingSeconds}s
</span>


</div>

</div>
);

}