interface Props {
 installation:{
  status:string;
  currentOperation:string|null;
  downloadProgress:number;
 };
}


export function QueueItem({
 installation,
}:Props){

return (
<div
className="
rounded-xl
border
border-zinc-800
bg-zinc-900
p-4
"
>

<div className="flex justify-between">

<span>
{installation.currentOperation}
</span>

<span className="text-zinc-400">
{installation.status}
</span>

</div>


</div>
);

}