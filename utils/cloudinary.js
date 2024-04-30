import cloudinary from "cloudinary"


export const delete_data =async(public_id)=>{
    try {
       const done= await cloudinary.v2.uploader.destroy(public_id);
       return done
    } catch (error) {
        console.log("An error occured",error);
    }
}

export const create_data = async(data,foldername)=>{
    const mycloud = await cloudinary.v2.uploader.upload(data, {
      folder: foldername,
    });
    return mycloud
}