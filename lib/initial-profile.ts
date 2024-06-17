import { currentUser, auth} from "@clerk/nextjs/server";

import { db } from "./db";

export const initialProfile = async () => {
    const user  = await currentUser(); // Get the currently logged in user. This will be a Clerk User object, which has all of the information about the user that you can access through this object. For example, if you want to

    if(!user){
         // If there is no user then we need to log them out
         return auth().redirectToSignIn();
    }

    const profile =  await db.profile.findUnique({
        where : {
            userId : user.id
        }
    })

    if (profile) {
        return profile;
    }

    const newProfile = await db.profile.create({
        data : {
            userId : user.id,
            name : `${user.firstName} ${user.lastName}`,
            imageUrl : user.imageUrl,
            email : user.emailAddresses[0].emailAddress
        }
    })

    return newProfile;
}