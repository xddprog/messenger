import { Image } from 'antd';


function MessageImages({ images }) {
    return (
        <>
            {images.length !== 0 && (
                <div className="flex flex-col gap-0.5 mt-[10px] mb-[10px]">
                    <div className="flex gap-0.5">
                        {images.slice(0, 3).map((image) => {
                            return (
                                <Image
                                    src={image}
                                    key={image}
                                    className='border-none object-cover h-full max-h-[150px] min-h-[150px]'
                                    width={`${
                                        images.slice(0, 3).length == 1 ? 100 : 100 / images.slice(0, 3).length
                                    }%`}
                                />
                            )
                        })}
                    </div>
                    <div className="flex gap-0.5">
                        {images.slice(3, 5).map((image) => {
                            return (
                                <Image
                                    src={image}
                                    key={image}
                                    className='border-none object-cover h-full max-h-[150px] min-h-[150px]'
                                    width={`${
                                        images.slice(3, 5).length == 1 ? 100 : 100 / images.slice(3, 5).length
                                    }%`}
                                />
                            )
                        })}
                    </div>
                    <div >
                        {images.slice(6, 8).map((image) => {
                            return (
                                <Image
                                    src={image}
                                    key={image}
                                    className='border-none object-cover h-full max-h-[150px] min-h-[150px]'
                                    width={`${
                                        images.slice(6, 8).length == 1 ? 100 : 100 / images.slice(6, 8).length
                                    }%`}
                                />
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    );
}

export default MessageImages;