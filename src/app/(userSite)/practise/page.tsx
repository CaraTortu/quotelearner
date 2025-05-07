"use client";
import { useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";

const lines = [
    /*
    "I have often blushed to acknowledge him",
    "Yet was his mother fair ; there was good sport at his making and the whoreson must be acknowledged",
    "Know that we have divided in three our kingdom and tis our fast intent",
    "To shake all cares and business from our age",
    "Sir , I love you more than words can wield the matter",
    "I am made of that self-same metal as my sister",
    "Nothing will come of nothing",
    "Unhappy that I am I cannot heave my heart into my mouth",
    "Here I disclaim all my paternal care thou my sometime daughter",
    "Come not between the dragon and his wrath",
    "Only we shall retain the name and all addition to the king",
    "What wouldst thou do old man ? thinkst thou that duty shall have dread to speak when power to flattery bows ?",
    "Thou hast her , France. Let her thine , for we have no such daughter , nor shall ever see that face of hers again",
    "Better thou hadst not been born than not to have pleased me better",
    "She is herself a dowry",
    "Fairest Cordelia , that art most rich being poor",
    "Such unconstant starts are we like to have from him as this of Kent's banishment",
    "If our father carry authority with such dispositions as he bears , this last surrender of his will but offend us ... We must do something , and i' the heat",
    "Wherefore should I stand in the plague of custom , and permit the curiosity of nations to deprive me , for that I am some twelve or fourteen moonshines lag of my brother ? Why bastard ? Wherefore base ?",
    "Legitimate Edgar , I must have your land ... Edmund the base shall top the legitimate : I grow I prosper",
    "Kent banished thus ! And France in choler parted ! And the king gone tonight ! Subscribed his power !",
    "What needed , then , that terrible dispatch of it into your pocket ?",
    "... It is a letter from my brother that I have not o'er-read and for so much as I have perused , I find it not fit for your o'er-looking",
    "Abhorred villain ! Unnatural , detested , brutish villain ! Worse than brutish !",
    "This is the excellent foppery of the world , that , when we are sick in fortune - often the surfeit of our own behaviour - we make guilty of our disasters the sun , the moon and the stars",
    "A credulous father and a brother noble , whose nature is so far from doing harms that he suspects none ; on whose foolish honesty my practises ride easy ! I see the business. Let me , if not by birth , have lands by wit : All with me's meet that I can fashion fit",
    "By day and night he wrongs me ; every hour he flashes into one gross crime or other , that sets us all at odds : I'll not endure it : His Knights grow riotous , and himself upbraids us on every trifle",
    "Let him to my sister , whose mind and mine , I know , in that are one , not to be over-rul'd. Idle old man , That still would manage those authorities that he hath given away !",
    "Old fools are babes again",
    "My lady's father",
    "All thy other titles thou hast given away",
    "Thou hadst little wit in thy bald crown when thou gavest thy golden one away ...",
    "Though madest thy daughters thy mothers",
    "Your insolent retinue do hourly carp and quarrel",
    "Does any here know me ? This is not Lear , Does Lear walk thus ? Speak Thus ? Where are his eyes ?",
    "Into her womb convey sterility !",
    "That she may feel how sharper than a serpent's tooth it is to have a thankless child",
    "I have another daughter who , I am sure , is kind and comfortable",
    "This milky gentleness",
    "Shalt see , thy other daughter will use thee kindly ; for though she's as like this as a crab's like an apple , yet I can tell what I can tell",
    "I did her wrong",
    "I can tell why a snail has a house",
    "Thou shouldst not have been old till thou hadst been wise",
    "O , let me not be mad , not mad , sweet heaven ! Keep me in temper ; I would not be mad !",
    */

    // NEW
    "Have you heard of no likely wars twixt the Dukes of Cornwall and Albany ?",
    "The Duke be here tonight ! The better ! Best ! This weaves itself perforce into my business .",
    "Here stood he in the dark , his sharp sword out , mumbling of wicked charms , conjuring the moon to stand auspicious mistress .",
    "I told him the revenging Gods gainst parricides did all their thunders bend ... With his prepared sword he charges home my unprovided body .",
    "I will proclaim it that he which finds him shall deserve our thanks , bringing the murderous coward to the stake ; he that conceals him , death .",
    "Of my land loyal and natural boy , I'll work the means to make thee capable .",
    "Draw , you rascal ; you come with letters against the king , and take vanity the puppet's part against the royalty of her father .",
    "A knave , a rascal , an eater of broken meats ; a base proud , shallow , beggarly , three-suited , hundred pound , filthy , worsted stocking knave .",
    "I have seen better faces in my time than stands on any shoulder that I see before me at this instant .",
    "Call not your stocks for me ; I serve the king on whose employment I was sent to you ; you shall do small respect , show too bold malice against the grace and person of my master , stocking his messenger .",
    "The king must take it ill , that he so slightly valu'd in his messenger , should have him thus restrained .",
    "I'll answer that .",
    "They durst not do't . They could not , would not do't ; 'tis worse than murder to do upon respect such violent outrage .",
    "O ! how this mother swells up toward my heart ; Hysterica passio ? Down , thou climbing sorrow ! Let go thy hold when a great wheel runs down a hill , lest it break thy neck with following it .",
    "Deny to speak with me ! They are sick ! They are weary . They have travelled hard tonight ! Mere fetches , the images and revolt of taking off .",
    "We are not ourselves when nature , being oppress'd , commands the mind to suffer with the body .",
    "I would have all well betwixt you .",
    "Beloved Regan , thy sister's naught .",
    "I cannot think my sister in the least would fail her obligation ; if sir , perchance she have restrained the riots of your followers , 'tis on such ground and to such wholesome end as clears her from all blame .",
    "O sir ! You are old ; nature in you stands on the very verge of her confine ; you should be ruled and led by some discretion that discerns your state better that you yourself .",
    "On my knees I beg that you'll vouchsafe me raiment , bed and food .",
    "Infect her beauty , you fen-suck'd fogs , drawn by the powerful sun , to fall and blast her pride .",
    "No Regan , thou shalt never have my curse : thy tender-hefted nature shall not give thee o'er harshness .",
    "I pray you father , being weak , seem so .",
    "Return to her ? And fifty men dismiss'd ! No , rather I abjure all roofs , and choose to wage against the enmity of the air .",
    "I prithee , daughter , do not make me mad .",
    "I can stay with Regan , I and my hundred knights .",
    "Not altogether so : I look'd not for you yet , nor am provided for your fit welcome .",
    "Why might not you , my lord , receive attendance from those that she calls servants , or from mine ?",
    "Man's life is cheap as beast's .",
    "You heavens , give me that patience , patience I need .",
    "A poor old man , as full of grief as age .",
    "Touch me with noble anger , and let not women's weapons , water-drops , stain my man's cheeks ! No , you unnatural hags , I will have such revenges on you both ...",
    "'Twill be a storm .",
    "My lord , entreat him by no means to stay .",
    "Alack ! The night comes on , and the bleak winds do sorely ruffle , for many miles about there's scarce a bush .",
    "Shut up your doors , my lord ; 'tis a wild night ."
];


type WordData = {
    original: string;
    isBlank: boolean;
    userInput?: string;
    isCorrect?: boolean;
};

function isOnlyLetters(str: string) {
    return /^[A-Za-z]+$/.test(str);
}

export default function Home() {
    const [maxWordsFactor, setMaxWordsFactor] = useState(3);
    const [words, setWords] = useState<WordData[] | null>(null);
    const [showOriginal, setShowOriginal] = useState(false);

    const generateSentence = () => {

        // Ensure a different sentence is selected
        const selectedLine = lines[Math.floor(Math.random() * lines.length)]!;

        const split = selectedLine.split(" ");
        const newWords: WordData[] = split.map((word) => ({
            original: word,
            isBlank: false,
        }));

        let sentenceMaxWords = Math.floor(newWords.filter(w => isOnlyLetters(w.original)).length / maxWordsFactor)

        if (sentenceMaxWords === 0) {
            sentenceMaxWords = 1
        }

        let blanks = 0;
        while (blanks < sentenceMaxWords) {
            const idx = Math.floor(Math.random() * newWords.length);

            if (!newWords[idx]) {
                continue
            }

            if (!newWords[idx].isBlank && isOnlyLetters(newWords[idx].original)) {
                newWords[idx].isBlank = true;
                newWords[idx].userInput = "";
                blanks++;
            }
        }

        setWords(newWords);
        setShowOriginal(false);
    };

    const updateInput = (index: number, value: string) => {
        if (!words) return;
        const newWords = [...words];
        newWords[index]!.userInput = value;
        setWords(newWords);
    };

    const checkAnswers = () => {
        if (!words) return;
        const updated = words.map((word) => {
            if (word.isBlank && word.userInput !== undefined) {
                return {
                    ...word,
                    isCorrect:
                        word.userInput.trim().toLowerCase() === word.original.toLowerCase(),
                };
            }
            return word;
        });
        setWords(updated);
        setShowOriginal(true);
    };

    return (
        <div className="pt-18 md:pt-4 w-full min-h-svh p-4 flex flex-col items-center gap-4">
            <h1 className="font-bold text-2xl pt-4">Welcome to your King Lear stuff</h1>
            <div className="flex gap-4">
                <Button
                    onClick={generateSentence}
                    variant="secondary"
                >
                    Generate sentence!
                </Button>
                <Input type="number" value={maxWordsFactor} onChange={(e) => setMaxWordsFactor(parseInt(e.target.value))} />
            </div>

            {words && (
                <>
                    <div className="flex flex-wrap text-xl">
                        {words.map((word, idx) =>
                            word.isBlank ? (
                                <Input
                                    key={idx}
                                    value={word.userInput}
                                    onChange={(e) => updateInput(idx, e.target.value)}
                                    className={`w-32 h-8 mb-1 text-center ml-2 ${word.isCorrect
                                        ? "bg-green-300 dark:bg-green-600"
                                        : word.isCorrect === false
                                            ? "bg-red-300 dark:bg-red-500"
                                            : "bg-white dark:bg-gray-500"
                                        }`}
                                />
                            ) : (
                                <span key={idx} className={isOnlyLetters(word.original) ? "pl-2" : ""}>{word.original}</span>
                            )
                        )}
                    </div>

                    <Button
                        onClick={checkAnswers}
                    >
                        Check Answers
                    </Button>
                </>
            )}

            {showOriginal && words && (
                <div className="mt-6 text-lg">
                    <p className="italic font-bold font-lexend">Original sentence:</p>
                    <div className="flex flex-wrap gap-2 font-mono text-xl">
                        {words.map((word, idx) => {
                            let color = "";
                            if (word.isBlank) {
                                color = word.isCorrect ? "text-green-400" : "text-red-400";
                            }

                            return (
                                <span key={idx} className={color}>
                                    {word.original}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

