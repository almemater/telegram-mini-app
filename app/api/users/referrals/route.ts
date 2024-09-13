import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import User from '@/models/user';
import { rewardPoints } from '@/libs/constants';

export async function POST(request: NextRequest) {
  console.log('POST request received');
  try {
    await connectMongoDB();

    const { userId, referralCode } = await request.json();

    if (!userId || !referralCode) {
      console.error('User ID and referral code are required');
      return NextResponse.json(
        { error: 'User ID and referral code are required' },
        { status: 400 }
      );
    }

    // Find the referrer by referral code
    const referrer = await User.findOne({ referralCode });
    // console.log('Referrer:', referrer);

    if (!referrer) {
      console.error('Invalid referral code');
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    // Find the referee by user ID
    const referee = await User.findOne({ id: userId });
    // console.log('Referee:', referee);

    if (!referee) {
      console.error('User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update referrer's points and referrals list
    const updatedReferrer = await User.findOneAndUpdate(
      { id: referrer.id },
      { 
        $inc: { points: rewardPoints.referFriend },
        $push: { referrals: referee.id }
      },
      { new: true }
    );
    // console.log('Updated referrer:', updatedReferrer);

    // Update referee's points
    const updatedReferee = await User.findOneAndUpdate(
      { id: referee.id },
      { $inc: { points: rewardPoints.referFriend } },
      { new: true }
    );
    // console.log('Updated referee:', updatedReferee);

    return NextResponse.json(
      { message: 'Referral processed successfully', referee: updatedReferee, referrer: updatedReferrer },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing referral:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    await connectMongoDB();

    const user = await User.findOne({ id: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const referredUsers = await User.find({ id: { $in: user.referrals } }).select('id first_name username');

    return NextResponse.json({ referredUsers });
  } catch (error) {
    console.error('Error fetching referred users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}