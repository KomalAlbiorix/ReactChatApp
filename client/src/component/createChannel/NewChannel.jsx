import { useState } from 'react';
import { Upload, Modal, Input, notification, Checkbox } from 'antd';
import { ArrowRightOutlined, CameraOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './newChannel.css';
import axios from 'axios';
import Constants from '../constant/Constants';

const NewChannel = ({ isCreateModalOpen, setIsCreateModalOpen, userList,currentId,setGroupListing }) => {
    const [isOpenUserListModal, setIsOpenUserListModal] = useState(false);

    const [groupName, setGroupName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [groupChatMember, setGroupChatMember] = useState([])
    const [member, setMember] = useState([])


    const MoveListPage = () => {
        setIsCreateModalOpen(false)
        setIsOpenUserListModal(true)
        setGroupChatMember(data => ({ ...data, groupName: groupName }))
    }

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    /**
     * Before upload check image is proper type or not
     * @param {*} file 
     * @returns 
     */
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            notification.success({
                message: "You can only upload JPG/PNG file!"
            })
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            notification.success({
                message: "Image must smaller than 2MB!"
            })
        }
        return isJpgOrPng && isLt2M;
    }

    /**
     * Handle image change
     * @param {*} info 
     */
    const handleImageChange = async (info) => {
        let temp = []
        // if (info.file.status === 'uploading') {
        //     setIsLoading(true)
        //     return;
        // }
        // if (info.file.status === 'done') {
        // Get this url from response in real world.
        await getBase64(info.file.originFileObj, imageUrl => {
            setImageUrl(imageUrl)
            setIsLoading(false)
            // temp.push({ groupImage: imageUrl })
            // setGroupChatMember(temp)
        }
        );
        // }
    };

    const handleUserSelect = (e, item) => {
        let memberArray =member
        if (e.target.checked) {
            memberArray.push(item._id)
            setGroupChatMember(data => ({ ...data, members: memberArray }))
        }
        else {
            let members = groupChatMember.members.filter(i => i !== item._id)
            setGroupChatMember(data => ({ ...data, members: members }))

        }
    }

    const createNewGroup=async()=>{
        groupChatMember.members.push(currentId)
        console.log("groupp",groupChatMember)

        await axios.post(Constants.GROUP_CHAT_URL,groupChatMember).then(async res => {
            if(res.data){
                await axios.get(Constants.GROUP_CHAT_URL +currentId ).then(chatRes => {
                    if(chatRes.data){
                        setGroupListing(chatRes.data)
                    }
                    debugger
                })
            }
        })

    }
    return (<>

        <Modal title="New Group Chat" visible={isCreateModalOpen}
            onCancel={() => setIsCreateModalOpen(false)}
            footer={
                groupName ? [<ArrowRightOutlined style={{ fontSize: "20px" }} onClick={() => MoveListPage()} />] : ""}>
            <Upload
                name="avatar"
                listType="picture-card"
                className="newChannel"
                showUploadList={false}
                action={imageUrl}
                beforeUpload={beforeUpload}
                onChange={handleImageChange}
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : <CameraOutlined />}
            </Upload>
            <Input type="text" placeholder="Group Name" onChange={(e) =>
                setGroupName(e.target.value)}></Input >
        </Modal>

        <Modal title="Create New group" visible={isOpenUserListModal}
            onCancel={() => setIsOpenUserListModal(false)}
            footer={[<button onClick={()=>createNewGroup()}>Done</button>]}

        >
            {userList.length > 0 ? userList.map(item => {
                return <div className="userList">
                    <p>{item.username} <Checkbox className="userCheckbox" onClick={(e) => handleUserSelect(e, item)}></Checkbox ></p>
                </div>
            }) : ""}
        </Modal>
     
    </>)
}

export default NewChannel