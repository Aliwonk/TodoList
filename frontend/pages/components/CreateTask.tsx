export default function CreateTask(props: any) {
    const hidden = props.hidden;
    let hiddenClass = '';

    if(hidden) {
        hiddenClass = 'hidden';
    }

    return(
        <div className={hiddenClass}>CreateTask</div>
    )
}