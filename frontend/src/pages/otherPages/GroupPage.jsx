import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroup } from "../../requests/api/groups";

function GroupPage() {
    const { groupId } = useParams();
    const [group, setGroup] = useState({});

    useEffect(() => {
        getGroup(groupId).then((res) => setGroup(res.data));
    }, []);

    return <div>GroupPage</div>;
}

export default GroupPage