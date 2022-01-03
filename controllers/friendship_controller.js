const Friendship = require('../models/friendship');
const User = require('../models/user');

module.exports.toggleFriendship = async function(req,res){
    try{
        let user = await User.findById(req.user.id);
        let friend = await User.findById(req.params.id);
        let friendAdded = false;
        
        // Check if friendship already exists
        let existingFriendship = await Friendship.findOne({
            from_user: req.user.id,
            to_user: req.params.id
        });

        // Also check vice versa friendship exists or not
        let existingFriendshipReverse = await Friendship.findOne({
            from_user: req.params.id,
            to_user: req.user.id
        });

        // If friendship already exists then remove it
        if(existingFriendship || existingFriendshipReverse){
            if(existingFriendship){
                user.friendships.pull(existingFriendship._id); // Remove from the friend list of user
                user.save();
                friend.friendships.pull(existingFriendship._id); // Remove from the friend list of friend
                friend.save();
                existingFriendship.remove();
            }else{
                user.friendships.pull(existingFriendshipReverse._id);
                user.save();
                friend.friendships.pull(existingFriendshipReverse._id); 
                friend.save();
                existingFriendshipReverse.remove();
            }
        }else{
            let friendship = await Friendship.create({
                from_user: req.user._id,
                to_user: req.params.id
            });

            user.friendships.push(friendship);
            user.save();
            friend.friendships.push(friendship);
            friend.save();
            friendAdded=true;
        }
        return res.redirect('back');
    }catch(err){
        console.log('Error in adding friend', err);
    }
}