import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { 
    updateStart, 
    updateSuccess, 
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure
} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashProfile() {
    const { currentUser, error } = useSelector((state) => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [imageFileUpLoading, setImageFileUpLoading] = useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [fromData, setFromData] = useState({})
    const filePickerRef = useRef()
    const dispath = useDispatch()
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
      }, [imageFile]);    

    const uploadImage = async () => {
        // service firebase.storage {
        //     match /b/{bucket}/o {
        //     match /{allPaths=**} {
        //       allow read;
        //       allow write: if
        //       request.resource.size < 2 * 1024 * 1024 &&
        //       request.resource.contentType.matches('image/.*')
        //     }
        //   }
        // }
        setImageFileUpLoading(true)
        setImageFileUploadError(null)
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        
                setImageFileUploadProgress(progress.toFixed(0));
            }, (error) => {
                setImageFileUploadError(
                    'Could not upload image (File must be less than 2MB)'
                );
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUpLoading(false)
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFromData({ ...fromData, profilePicture: downloadURL })
                    setImageFileUpLoading(false)
                })
            }
        )
    }

    const handleChange = (e) => {
        setFromData({ ...fromData, [e.target.id]: e.target.value })
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setUpdateUserError(null)
        setUpdateUserSuccess(null)
        if(Object.keys(fromData).length === 0) {
            setUpdateUserError('No change made')
            return
        }
        if(imageFileUpLoading) {
            setUpdateUserError('Please wain for image to upload')
            return
        }
        try {
            dispath(updateStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fromData)
            })
            const data = await res.json()
            if(!res.ok) {
                dispath(updateFailure(data.message))
                setUpdateUserError(date.message)
            } else {
                dispath(updateSuccess(data))
                setUpdateUserSuccess("Use's profile updated seccessfully")
            }
        } catch (error) {
            dispath(updateFailure(data.message))
            setUpdateUserError(date.message)
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false)
        try {
            dispath(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if(!res.ok) {
                dispath(deleteUserFailure(data.message))
            } else {
                dispath(deleteUserSuccess(data))
            }
        } catch (error) {
            dispath(deleteUserFailure(error.message))
        }
    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-4xl'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className='relative w-32 h-32 self-center cursor-pointer overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
                    {imageFileUploadProgress && (
                        <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} strokeWidth={5} styles={{ root:{ width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', }, path: { stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})` } }} />
                    )}
                    <img src={ imageFileUrl || currentUser.profilePicture } alt="user" className={`rounded-full w-full h-full object-cover border-4 border-[#cf4664] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'} `} />
                </div>  
                {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
                <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
                <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} />
                <TextInput type='password' id='password' placeholder='******' defaultValue={currentUser.password} />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                    Update Account
                </Button>
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert color='success' className='mt-5'>
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color='failure' className='mt-5'>
                    {updateUserError}
                </Alert>
            )}
            {error && (
                <Alert color='failure' className='mt-5'>
                    {error}
                </Alert>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <HiOutlineExclamationCircle className='h-14 w-14 text-red-700 dark:text-gray-200 mb-5 mx-auto' />
                    <h3 className='mb-7 text-center text-lg text-gray-500 dark:text-gray-400 font-medium font-'>Are you sure ? You want to delete account ?</h3>
                    <div className='flex justify-center gap-7'>
                        <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>No cancel</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
