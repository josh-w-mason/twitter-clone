import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { ProfileImage } from "./ProfileImage";
import { useSession } from "next-auth/react";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import { IconHoverEffect } from "./IconHoverEffect";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./LoadingSpinner";
import { HiX } from "react-icons/hi";
import { type MouseEvent } from "react";

type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
};

type InfiniteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewTweets: () => Promise<unknown>;
  tweets?: Tweet[];
};

export function InfiniteTweetList({
  tweets,
  isError,
  isLoading,
  fetchNewTweets,
  hasMore = false,
}: InfiniteTweetListProps) {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error...</h1>;
  if (tweets == null || tweets.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No tweets</h2>
    );
  }

  return (
    <>
      <ul>
        <InfiniteScroll
          dataLength={tweets.length}
          next={fetchNewTweets}
          hasMore={hasMore}
          loader={<LoadingSpinner />}
        >
          {tweets.map((tweet) => {
            return <TweetCard key={tweet.id} {...tweet} />;
          })}
        </InfiniteScroll>
      </ul>
      {console.log("INFINITE TWEET LIST GENERATED")}
    </>
  );
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

function TweetCard({
  id,
  user,
  content,
  createdAt,
  likeCount,
  likedByMe,
}: Tweet) {
  const trpcUtils = api.useContext();
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;

        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id == id) {
                  return {
                    ...tweet,
                    likeCount: tweet.likeCount + countModifier,
                    likedByMe: addedLike,
                  };
                }
                return tweet;
              }),
            };
          }),
        };
      };
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
      trpcUtils.tweet.infiniteFeed.setInfiniteData(
        { onlyFollowing: true },
        updateData
      );
      trpcUtils.tweet.infiniteProfileFeed.setInfiniteData(
        { userId: user.id },
        updateData
      );
    },
  });

  const deleteTweet = api.tweet.deleteTweet.useMutation({
    onSuccess: ({ success }) => {
      console.log("API success??");
    },
  });

  //////
  /////

  function handleDeleteTweet() {
    deleteTweet.mutate(
      { id },
      {
        onSuccess: ({ success }) => {
          if (success) {
            const updateData: Parameters<
              typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
            >[1] = (oldData) => {
              if (oldData == null) return;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  return {
                    ...page,
                    tweets: page.tweets.filter((tweet) => tweet.id !== id),
                  };
                }),
              };
            };

            trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
            trpcUtils.tweet.infiniteFeed.setInfiniteData(
              { onlyFollowing: true },
              updateData
            );
            trpcUtils.tweet.infiniteProfileFeed.setInfiniteData(
              { userId: user.id },
              updateData
            );
          }
        },
      }
    );
  }

  // NOTES::

  // deleteTweet.mutate({ id }, { ... }): Here, you're using the deleteTweet mutation with the mutate function. You're passing the id of the tweet to be deleted. The second parameter is an object that holds the onSuccess handler.

  // onSuccess: ({ success }) => { ... }: This is the success handler for the deleteTweet mutation. When the deletion is successful, the success parameter will be true, and this block of code will execute.

  // const updateData: ...: This line declares a function named updateData, which will be used to modify the old data to reflect the deletion. The updateData function has a specific type inferred based on the setInfiniteData function of trpcUtils.tweet.infiniteFeed.

  // if (oldData == null) return;: This check ensures that you only proceed if there's valid data to work with. If the oldData is null (which should not happen), the function returns immediately.

  // Mapping through pages and tweets: The updateData function maps through the pages in the old data and then, within each page, it maps through the tweets. It uses the filter function to remove the tweet with the id that matches the deleted tweet's id.

  // trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);: This line updates the main feed by calling setInfiniteData from trpcUtils.tweet.infiniteFeed. It provides an empty object as the first argument to indicate that no filters are applied, and then it uses the updateData function to modify the old data.

  // Similarly, the next two lines update the feeds that are filtered by following status and user ID, respectively.

  // The goal of this code is to ensure that when a tweet is deleted, the affected feeds are updated accordingly by removing the deleted tweet from the data, all while utilizing trpc's provided functions to manage your data updates. This way, your UI will automatically reflect the changes, and you don't need to manually manipulate React state for these updates.

  /////
  ////////

  function handleToggleLike() {
    toggleLike.mutate({ id });
  }

  const session = useSession();
  const isCurrentUserTweet = session.data?.user.id === user.id;

  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">
            {dateTimeFormatter.format(createdAt)}
          </span>
          {isCurrentUserTweet && (
            <HiX
              className="cursor-pointer text-lg text-red-500"
              onClick={handleDeleteTweet}
            />
          )}
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <HeartButton
          onClick={handleToggleLike}
          isLoading={toggleLike.isLoading}
          likedByMe={likedByMe}
          likeCount={likeCount}
        />
      </div>
    </li>
  );
}

type HeartButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  likedByMe: boolean;
  likeCount: number;
};

function HeartButton({
  isLoading,
  onClick,
  likedByMe,
  likeCount,
}: HeartButtonProps) {
  const session = useSession();
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;

  if (session.status !== "authenticated") {
    return (
      <div className="mb-1 mt-1 flex items-center gap-3 self-start text-gray-500">
        <HeartIcon />
        <span>{likeCount}</span>
      </div>
    );
  }

  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={`group -ml-2 flex items-center gap-1 self-start transition-colors duration-200 ${
        likedByMe
          ? "fill-red-500"
          : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
      }`}
    >
      <IconHoverEffect red>
        <HeartIcon
          className={`transition-colors duration-200 ${
            likedByMe
              ? "fill-red-500"
              : "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
          }`}
        />
      </IconHoverEffect>
      <span>{likeCount}</span>
    </button>
  );
}
