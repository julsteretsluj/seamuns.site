(function () {
  "use strict";

  const phaseEmoji = {
    "Roll call": "📋",
    "Opening speeches": "🎤",
    "Floor open": "🏛️",
    "Moderated caucus": "🗣️",
    "Unmoderated caucus": "💬",
    "Voting procedure": "🗳️",
    "Points and motions": "📌",
  };

  const procedureFunFacts = [
    "In crisis committees, the dais can send out 'crisis updates' at any time—delegates must respond to breaking scenarios.",
    "Specialized committees like the ICJ (International Court of Justice) use different rules: no resolutions, but rather cases and judgments.",
    "In crisis, 'directives' or 'crisis notes' replace traditional resolutions; they are often single-delegation actions with immediate effect.",
    "Joint Crisis Committees (JCC) have two rooms; actions in one room can change the scenario in the other.",
    "The chair's main job is to maintain order and ensure the Rules of Procedure (ROP) are followed—not to debate substance.",
    "Only one substantive motion may be on the floor at a time; the second motion is out of order until the first is disposed of.",
    "Points of Order are in order at any time and must be recognized by the chair; they address procedure, not substance.",
    "Present and voting means a delegation cannot abstain on substantive votes—only yes or no.",
    "In many crisis committees, 'backroom' staff play characters; delegates send notes to them and receive in-character responses.",
    "A motion to divide the question lets the committee vote on parts of a resolution separately.",
    "Roll-call voting: each delegation is called by name; they may vote yes, no, abstain, or pass (called again at the end).",
    "Moderated caucus has a topic and time limit; unmoderated caucus is free discussion with no formal list.",
    "Crisis committees often use 'power rankings' or 'influence' that change based on delegate actions.",
    "The motion to table postpones discussion indefinitely; it is not debatable and requires a majority.",
    "Points of Parliamentary Inquiry ask the chair about procedure; the chair answers briefly.",
    "In historical crisis committees, the timeline can be altered by delegate decisions—'what if' scenarios.",
    "Yielding time: a speaker may yield to questions, to another delegation, or to the chair (chair usually declines).",
    "Closing the speakers list requires a vote (often two-thirds); once closed, no one may add their name.",
    "Special committees (e.g. ECOSOC, regional bodies) may use slightly different ROP than the General Assembly.",
    "In crisis, 'press corps' or 'media' delegates can publish stories that affect the committee's perception.",
    "The motion to move into voting procedure is not debatable; the committee votes immediately.",
    "Dividing the house: delegates physically separate for a count (e.g. for/against) instead of a show of placards.",
    "Crisis notes are usually confidential; the dais reads them and updates the scenario accordingly.",
    "Reconsideration is only in order when moved by a delegation that voted on the prevailing side.",
    "Adopting a resolution by consensus means the chair asks for objections; if none, no vote is taken.",
    "In crisis, 'directives' are short, actionable notes; the dais decides which ones to implement and in what order.",
    "The motion to extend debate keeps the floor open; it is often used when delegates need more time before voting.",
    "Quorum is the minimum number of delegations that must be present for the committee to conduct business.",
    "In ICJ-style committees, delegates argue as 'counsel' for applicant or respondent; there are no resolutions.",
    "Crisis cabinets can have a 'Prime Minister' or 'President' who may have special powers under the rules.",
    "A motion to set the agenda determines which topic the committee will discuss first; it requires a vote.",
    "Points of Personal Privilege address the delegate's ability to participate (e.g. cannot hear, need water).",
    "In fantasy or crisis committees, 'death' or 'removal' of a character is possible—the dais controls the story.",
    "The right of reply allows a delegate to respond to a personal attack; the chair may limit time and number.",
    "Friendly amendments are accepted by all sponsors and need no vote; unfriendly amendments require a vote.",
    "In UN4MUN, 'informal informals' replace unmoderated caucus—more emphasis on consensus and consultation.",
    "The chair may rule a motion dilatory (wasting time) or out of order and need not put it to a vote.",
    "Crisis 'updates' can be read aloud by the dais; delegates then react with new directives or speeches.",
    "A motion to suspend the meeting (recess) is not debatable; the committee votes and then breaks.",
    "In regional bodies (AU, EU, ASEAN), rules may differ—e.g. consensus-based or rotating presidency.",
    "Sponsors of a resolution speak first when it is introduced; signatories may or may not speak depending on ROP.",
    "Roll call is usually taken at the start; some committees allow a delegation to be added later by consent or vote.",
    "The motion to close debate ends discussion and moves to an immediate vote; often requires two-thirds.",
    "In JCC, 'joint crisis updates' affect both committees; coordination between rooms is part of the game.",
    "Decorum means proper language and behavior; the chair can warn or remove delegates who violate it.",
    "A sub-amendment amends an amendment; it is voted on first, then the amendment, then the resolution.",
    "Crisis 'frontroom' is the dais you see; 'backroom' is staff who run the scenario and play NPCs.",
    "Setting the speaking time (e.g. 90 seconds for the list) is a motion that requires a vote.",
    "The motion to move to previous question is another way to close debate and vote immediately.",
    "In historical crisis, research matters—real events and figures can be referenced to persuade the dais.",
    "The chair does not vote except to break a tie in some rules; the chair does not participate in debate.",
    "Signatories to a resolution may support or merely wish to see it debated; they need not vote yes.",
    "Suspension of the rules requires a two-thirds vote in most ROP; used for special procedures.",
    "In crisis, 'portfolio powers' may let certain roles (e.g. military) take actions others cannot.",
    "The general speakers list is the default list for formal debate; delegates add their names to speak.",
    "A motion to limit the number of times a delegation may speak on a topic is in order in many ROP.",
    "Crisis committees often run in 'real time'—updates every 15–30 minutes—or in 'committee time' (session-based).",
    "The motion to adjourn ends the session; it is not debatable and requires a majority.",
    "Points of Information are only in order when the speaker has yielded to questions.",
    "In specialized committees (e.g. UNEP, WHO), topic areas may have their own terminology and precedents.",
    "The rapporteur (or secretary) often takes roll call and records votes; the chair presides.",
    "Double delegation means two delegates represent one country; they may share or split speaking time.",
    "Crisis 'blocs' (e.g. military, cabinet) can receive joint updates or have bloc-wide actions.",
    "The motion to reopen the speakers list is in order after it was closed; requires a vote.",
    "In fantasy committees, the dais may allow 'character powers' that bend real-world procedure for fun.",
    "The chair should remain neutral on substance; ruling on procedure only keeps the committee fair.",
    "Voting 'yes' means in favor, 'no' against, 'abstain' means no position; abstentions often do not count toward the majority.",
    "In some crisis committees, 'press' can interview delegates; their articles may influence the scenario.",
    "The motion to divide the house is used when a count is needed—delegates stand or move to show for/against.",
    "Advisory panels (e.g. ICJ advisory opinions) use different procedure than contentious cases.",
    "Time limits for moderated caucus are set by the motion (e.g. 10 minutes total, 60 seconds per speaker).",
  ];

  const procedureQuestions = [
    {
      phase: "Roll call",
      scenario:
        "You have just gavelled in. You call the first delegation. They respond \"Present.\" The next delegation says \"Present and voting.\" A third delegation does not respond when their name is called. What do you do?",
      options: [
        "Mark them absent and move to the next delegation.",
        "Call their name again and wait for a response before continuing.",
        "Skip the roll call and move to opening speeches.",
        "Ask the committee to vote on whether to mark them absent.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "You marked them absent. In standard procedure, the chair typically calls the delegation a second time before marking absent; some committees allow a third call. The session continues with roll call.",
        correct:
          "You call the delegation again. Standard procedure is to call each delegation at least twice before marking absent. They respond \"Present\" on the second call, and roll call continues.",
      },
    },
    {
      phase: "Opening speeches",
      scenario:
        "During opening speeches, a delegate is speaking at the podium. Another delegate raises their placard and calls \"Point of Order.\" They claim the speaker has exceeded the time limit. The timer shows 5 seconds remaining. What do you do?",
      options: [
        "Recognize the Point of Order and yield to the delegate to state it.",
        "Rule the Point of Order out of order and ask the delegate to wait until the speaker has finished.",
        "Immediately gavel the current speaker down and move to the next speaker.",
        "Suspend the session for a chair consultation.",
      ],
      correctIndex: 0,
      narratives: {
        wrong: "You ruled the point out of order. Points of Order are in order at any time and must be recognized by the chair. The delegate restates their point; you recognize it and the speaker is reminded of the time. The session continues.",
        correct:
          "You recognize the Point of Order. The delegate states that the speaker is over time. You thank them, remind the speaker of the remaining time, and the speaker concludes. Procedure continues smoothly.",
      },
    },
    {
      phase: "Floor open",
      scenario:
        "The floor is open for motions. A delegate moves for a moderated caucus of 10 minutes with 60-second speaking time. Another delegate immediately moves for an unmoderated caucus of 15 minutes. What do you do?",
      options: [
        "Accept both motions and put the moderated caucus to a vote first, then the unmoderated if it fails.",
        "Rule the second motion out of order because only one motion may be on the floor.",
        "Accept both and let the committee choose which to vote on first.",
        "Combine them into one motion for a 25-minute mixed caucus.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "You accepted both motions. In standard procedure, only one substantive motion is on the floor at a time. You clarify this, take the first motion (moderated caucus), and vote. After it is disposed of, the unmoderated motion may be raised. The session continues.",
        correct:
          "You rule the second motion out of order and explain that only one motion may be on the floor at a time. The first motion (moderated caucus) is voted on. It passes, and the moderated caucus begins.",
      },
    },
    {
      phase: "Moderated caucus",
      scenario:
        "During a moderated caucus, a delegate on the speakers list yields their remaining time to another delegation. That delegation is not on the list. What do you do?",
      options: [
        "Allow the yield; any delegation may receive yielded time.",
        "Rule the yield out of order; the receiving delegation must be on the speakers list.",
        "Allow the yield only if no other delegation objects.",
        "Suspend the caucus and take a vote on whether to allow the yield.",
      ],
      correctIndex: 0,
      narratives: {
        wrong: "You ruled the yield out of order. In many committees, the speaker may yield remaining time to another delegation even if they are not on the list. You reverse the ruling and allow the yield; the receiving delegation speaks. The caucus continues.",
        correct:
          "You allow the yield. The speaker may yield remaining time to another delegation. The receiving delegation uses the remaining time, and the next speaker on the list is called. The caucus continues.",
      },
    },
    {
      phase: "Voting procedure",
      scenario:
        "The committee has moved into voting procedure on draft resolutions. A delegate raises their placard and says \"Point of Parliamentary Inquiry.\" They ask: \"In what order will we vote on the resolutions?\" What do you do?",
      options: [
        "Rule that no points are in order during voting procedure.",
        "Recognize the Point of Parliamentary Inquiry and answer that the committee will vote in the order resolutions were introduced (or as per your rules).",
        "Table the question and move to the first resolution immediately.",
        "Allow the delegate to make a short speech to propose an order.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "You ruled no points in order. Points of Parliamentary Inquiry are generally in order during voting to clarify procedure. You recognize the point and answer: resolutions are voted on in the order submitted (or as per your ROP). Voting proceeds.",
        correct:
          "You recognize the Point of Parliamentary Inquiry and answer that the committee will vote on draft resolutions in the order they were submitted (or as specified in your rules). The delegate thanks the chair, and voting begins.",
      },
    },
    {
      phase: "Roll call",
      scenario:
        "During roll call, a delegation responds \"Present and voting.\" Later, when the committee moves to voting procedure on a resolution, that same delegation asks to abstain. What do you do?",
      options: [
        "Allow them to abstain; they may change their status.",
        "Remind them they are present and voting and cannot abstain; their vote will be counted as yes or no.",
        "Suspend the meeting for a chair consultation.",
        "Put it to the committee to vote on whether to allow the abstention.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "In standard procedure, a delegation that announced 'Present and voting' has committed to casting a substantive vote (yes or no) and cannot abstain. You remind them and the vote proceeds.",
        correct:
          "You remind the delegation that they are present and voting and cannot abstain. Their vote will be counted as yes or no. They cast a vote, and voting continues.",
      },
    },
    {
      phase: "Opening speeches",
      scenario:
        "The speakers list for opening speeches is closed. A delegate who is not on the list raises their placard and requests to be added. What do you do?",
      options: [
        "Add them to the end of the list automatically.",
        "Inform them the list is closed; they may participate in caucuses or when the list reopens.",
        "Open the list again and allow all delegations to add their names.",
        "Put it to a vote of the committee.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Once the speakers list is closed, the chair typically does not add names unless the rules allow reopening. You inform the delegate they may participate in other ways. The session continues.",
        correct:
          "You inform the delegate that the speakers list is closed. They may participate in moderated or unmoderated caucuses, or when the list is reopened. Opening speeches continue.",
      },
    },
    {
      phase: "Floor open",
      scenario:
        "A delegate moves to set the speaking time for the general speakers list to 90 seconds. Another delegate moves to set it to 60 seconds. What do you do?",
      options: [
        "Accept both and vote on 90 seconds first, then 60 if it fails.",
        "Rule the second motion out of order; only one motion on the floor.",
        "Split the difference and set 75 seconds without a vote.",
        "Allow a brief debate, then vote on both in order proposed.",
      ],
      correctIndex: 0,
      narratives: {
        wrong: "Only one substantive motion is on the floor at a time. You take the first motion (90 seconds); if it fails, the second (60 seconds) may be moved. The committee votes.",
        correct:
          "You accept the first motion (90 seconds) and put it to a vote. It fails. The motion for 60 seconds is then moved and voted on. It passes, and the speaking time is set.",
      },
    },
    {
      phase: "Moderated caucus",
      scenario:
        "During a moderated caucus, the timer expires while a delegate is still speaking. They continue for another 15 seconds. What do you do?",
      options: [
        "Allow them to finish their sentence, then recognize the next speaker.",
        "Gavel them down immediately and call the next speaker.",
        "Add 15 seconds to the next speaker's time to be fair.",
        "Suspend the caucus and issue a warning.",
      ],
      correctIndex: 0,
      narratives: {
        wrong: "Chairs often allow a delegate to finish their sentence after time expires, then move on. You do so and the caucus continues.",
        correct:
          "You allow the delegate to finish their sentence, then gavel and recognize the next speaker on the list. The moderated caucus continues.",
      },
    },
    {
      phase: "Points and motions",
      scenario:
        "A delegate has a Point of Information for the speaker at the podium. The speaker has not yielded. What do you do?",
      options: [
        "Recognize the Point of Information and let the delegate ask.",
        "Remind that Points of Information are only in order when the speaker yields to questions.",
        "Allow the point and let the speaker decide whether to take it.",
        "Rule all Points of Information out of order for this session.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Points of Information are in order only when the speaker yields to questions. You remind the delegate; the speaker continues and may yield later if they choose.",
        correct:
          "You remind the committee that Points of Information are in order only when the speaker yields to questions. The speaker continues their speech and yields when ready.",
      },
    },
    {
      phase: "Voting procedure",
      scenario:
        "The committee is voting on a resolution by roll call. A delegation is absent when their name is called. What do you do?",
      options: [
        "Count them as abstaining automatically.",
        "Call their name again; if no response, mark them absent and continue.",
        "Suspend the vote until they return.",
        "Count their vote as no.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "In roll-call voting, absent delegations are typically called again and then marked absent; they do not count as abstain or no. You proceed and the vote continues.",
        correct:
          "You call the delegation again. There is no response. You mark them absent and continue to the next delegation. The roll-call vote is completed.",
      },
    },
    {
      phase: "Roll call",
      scenario:
        "At the start of the session, you call the first delegation. They respond \"Present.\" The next says \"Present and voting.\" The third says \"Here.\" What do you do?",
      options: [
        "Rule 'Here' out of order and ask for 'Present' or 'Present and voting.'",
        "Accept 'Here' as equivalent to 'Present' and continue.",
        "Mark them absent for improper response.",
        "Suspend roll call and clarify proper responses.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Many committees accept 'Here' as equivalent to 'Present.' You accept it and continue roll call.",
        correct:
          "You accept 'Here' as equivalent to 'Present' and continue roll call. The session proceeds.",
      },
    },
    {
      phase: "Unmoderated caucus",
      scenario:
        "An unmoderated caucus is in progress. A delegate approaches the dais and asks you to rule on whether another delegation's proposed clause is in order. What do you do?",
      options: [
        "Rule on it immediately to keep order.",
        "Explain that during unmoderated caucus the floor is not formally before the committee; they may consult with you but you do not make formal rulings until the floor is open.",
        "Gavel the room to order and take a vote on the clause.",
        "Adjourn the caucus and return to formal session.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "During unmoderated caucus there is no formal floor; the chair typically does not make formal rulings. You explain and the caucus continues.",
        correct:
          "You explain that during unmoderated caucus the floor is not formally before the committee. They may discuss with you informally; formal rulings come when the committee is in session. The caucus continues.",
      },
    },
    {
      phase: "Moderated caucus",
      scenario:
        "A delegate moves for a moderated caucus of 8 minutes with 45-second speaking time. The motion is seconded. What do you do?",
      options: [
        "Accept the motion and immediately start the caucus.",
        "Put the motion to a vote. If it passes, then start the caucus.",
        "Rule it out of order and ask for a longer caucus.",
        "Allow debate on the motion before voting.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "A motion for a moderated caucus requires a vote (usually simple majority) before the caucus begins. You put it to a vote and then start the caucus if it passes.",
        correct:
          "You put the motion to a vote. It passes. You announce the caucus parameters and open the speakers list. The moderated caucus begins.",
      },
    },
    {
      phase: "Points and motions",
      scenario:
        "A delegate raises a Point of Order, claiming the speaker is off-topic. The speaker insists they are on topic. What do you do?",
      options: [
        "Rule in favor of the speaker and let them continue.",
        "Rule in favor of the point and gavel the speaker down.",
        "Make a ruling as chair: either the speaker is in order and may continue, or they are out of order and you recognize the next speaker.",
        "Put it to the committee to vote on whether the speaker is on topic.",
      ],
      correctIndex: 2,
      narratives: {
        wrong: "The chair rules on Points of Order; the committee does not vote. You make a ruling and the session continues.",
        correct:
          "You rule as chair that the speaker is in order (or out of order). You state your ruling briefly. The speaker continues or the next speaker is recognized.",
      },
    },
    {
      phase: "Opening speeches",
      scenario:
        "During opening speeches, the final speaker on the list has finished. No one has moved for a new session. What do you do?",
      options: [
        "Adjourn the committee immediately.",
        "Announce that the list is exhausted and the floor is open for motions.",
        "Automatically open an unmoderated caucus.",
        "Call for points or motions from the floor.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "When the speakers list is exhausted, the chair typically announces it and opens the floor for motions. You do so and the committee may move for caucuses or other business.",
        correct:
          "You announce that the speakers list for opening speeches is exhausted and the floor is open for motions. Delegates may move for moderated or unmoderated caucuses.",
      },
    },
    {
      phase: "Voting procedure",
      scenario:
        "A delegate moves to divide the question on a resolution—they want to vote on operative clause 3 separately. What do you do?",
      options: [
        "Rule the motion out of order; the resolution must be voted on as a whole.",
        "Accept the motion and put it to a vote. If it passes, vote on the clause separately.",
        "Allow the delegate to amend the resolution instead.",
        "Table the motion and proceed with the full resolution vote.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Dividing the question is a standard motion in voting procedure. You accept it, put it to a vote, and if it passes you vote on the specified part separately.",
        correct:
          "You accept the motion to divide the question. You put it to a vote; it passes. You then take a vote on operative clause 3 separately, then on the rest of the resolution.",
      },
    },
    {
      phase: "Floor open",
      scenario:
        "A delegate moves to close the speakers list. The motion is seconded. What do you do?",
      options: [
        "Close the list immediately.",
        "Put the motion to a vote. If it passes, the list is closed.",
        "Rule it out of order; the list cannot be closed.",
        "Allow one more speaker from the list before closing.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Closing the speakers list is a motion that requires a vote (often two-thirds). You put it to a vote and close the list if it passes.",
        correct:
          "You put the motion to close the speakers list to a vote. It passes. You announce that the list is closed and no further names may be added.",
      },
    },
    {
      phase: "Moderated caucus",
      scenario:
        "During a moderated caucus, a delegate yields their remaining time to the chair. What do you do?",
      options: [
        "Accept the yield and use the time to make a chair statement.",
        "Decline; the chair does not use yielded time. Return time to the floor or recognize the next speaker.",
        "Accept and use the time to summarize the debate.",
        "Rule the yield out of order.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Yielding to the chair is often declined; the chair does not speak as a delegate. You decline and recognize the next speaker or return time to the floor.",
        correct:
          "You decline the yield and explain that the chair does not use yielded time. You recognize the next speaker on the list. The caucus continues.",
      },
    },
    {
      phase: "Points and motions",
      scenario:
        "A delegate raises a Point of Personal Privilege and says the room is too cold. What do you do?",
      options: [
        "Rule the point out of order; temperature is not a personal privilege.",
        "Recognize the point and address it (e.g., ask the room to adjust or note the concern).",
        "Put it to a vote on whether to adjust the temperature.",
        "Suspend the session until the temperature is fixed.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Points of Personal Privilege relate to the comfort and ability of the delegate to participate (e.g., room conditions). You recognize it and address it briefly.",
        correct:
          "You recognize the Point of Personal Privilege. You note the concern and ask the room or staff to adjust if possible. You then return to the business at hand.",
      },
    },
    {
      phase: "Roll call",
      scenario:
        "During roll call, one delegation does not respond after two calls. You mark them absent. Later they arrive and ask to be marked present. What do you do?",
      options: [
        "Refuse; they were absent during roll call.",
        "Allow them to be marked present by general consent or a brief vote, then continue.",
        "Require a two-thirds vote to add them to the roll.",
        "Allow them to observe but not vote for the rest of the session.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Many committees allow a late-arriving delegation to be added to the roll by general consent or a simple vote. You do so and the session continues.",
        correct:
          "You put the question of adding the delegation to the roll to the committee. There is no objection (or the vote passes). You mark them present and the session continues.",
      },
    },
    {
      phase: "Voting procedure",
      scenario:
        "During voting on a resolution, a delegate requests a roll-call vote. What do you do?",
      options: [
        "Rule that only a show of placards is allowed.",
        "Accept the request; roll-call votes are typically in order when requested.",
        "Put it to a vote on whether to conduct a roll-call vote.",
        "Refuse; the chair has already called for a show of placards.",
      ],
      correctIndex: 2,
      narratives: {
        wrong: "A request for a roll-call vote is often put to the committee (e.g., one-fifth of members may require it). You take a vote on whether to conduct a roll-call vote.",
        correct:
          "You put the request for a roll-call vote to the committee. The requisite number supports it. You conduct the vote by roll call and record each delegation's vote.",
      },
    },
    {
      phase: "Opening speeches",
      scenario:
        "The first speaker has the floor. They ask to yield 30 seconds of their time to another delegation. What do you do?",
      options: [
        "Allow the yield; the receiving delegation may use the time.",
        "Rule that yields are only in order during moderated caucus.",
        "Allow only yields to questions, not to another delegation.",
        "Put it to the committee to vote on the yield.",
      ],
      correctIndex: 0,
      narratives: {
        wrong: "Yielding time to another delegation is often in order during opening speeches. You allow it and the receiving delegation speaks for the yielded time.",
        correct:
          "You allow the yield. The receiving delegation is given 30 seconds. When the time is used, you return to the original speaker for any remaining time or recognize the next speaker.",
      },
    },
    {
      phase: "Floor open",
      scenario:
        "A delegate moves to table the resolution currently on the floor. What do you do?",
      options: [
        "Rule the motion out of order; tabling is not allowed.",
        "Accept the motion to table; it is debatable and requires a majority (or as per rules).",
        "Accept the motion; it is not debatable and requires a majority.",
        "Put the resolution to an immediate vote instead.",
      ],
      correctIndex: 2,
      narratives: {
        wrong: "A motion to table is typically not debatable and requires a majority. You accept the motion and put it to an immediate vote.",
        correct:
          "You accept the motion to table. You put it to an immediate vote (no debate). It passes. The resolution is tabled and the committee moves to the next item.",
      },
    },
    {
      phase: "Moderated caucus",
      scenario:
        "The moderated caucus topic is 'Humanitarian access.' A delegate begins speaking about climate change. What do you do?",
      options: [
        "Let them finish, then remind the next speaker to stay on topic.",
        "Rule them out of order and gavel them down; recognize the next speaker.",
        "Extend the caucus time to allow more topics.",
        "Close the speakers list and open a new caucus.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Speakers in a moderated caucus must stay on the announced topic. You rule the delegate out of order and recognize the next speaker.",
        correct:
          "You rule the delegate out of order for being off-topic. You gavel and recognize the next speaker on the list. The caucus continues on humanitarian access.",
      },
    },
    {
      phase: "Points and motions",
      scenario:
        "A delegate raises a Point of Parliamentary Inquiry: 'What is the required majority for this vote?' What do you do?",
      options: [
        "Rule that parliamentary inquiries are not in order during voting.",
        "Recognize the point and answer: typically simple majority for procedural, two-thirds for substantive (or as per your rules).",
        "Allow the delegate to make a short speech on the matter.",
        "Table the question and proceed with the vote.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Points of Parliamentary Inquiry are in order to clarify procedure. You recognize the point and answer according to your rules. Voting continues.",
        correct:
          "You recognize the Point of Parliamentary Inquiry and answer that this vote requires a simple majority (or two-thirds, as applicable). The delegate thanks the chair and the vote proceeds.",
      },
    },
    {
      phase: "Unmoderated caucus",
      scenario:
        "An unmoderated caucus is about to end. One minute before time, you gavel and announce the time. Delegates ignore the announcement. What do you do?",
      options: [
        "Let the caucus run over until they return to order.",
        "Gavel again at the end of time and declare the caucus over; the committee is back in session.",
        "Add 5 minutes and announce the new end time.",
        "Adjourn the committee for the day.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "The chair is responsible for keeping time. You gavel at the end of the caucus and declare the committee back in session.",
        correct:
          "You gavel at the end of the allotted time and announce that the unmoderated caucus is over and the committee is back in session. You open the floor for motions.",
      },
    },
    {
      phase: "Voting procedure",
      scenario:
        "A resolution has just been voted on and passed. A delegate immediately moves to reconsider the vote. What do you do?",
      options: [
        "Rule the motion out of order; the vote is final.",
        "Accept the motion; it is typically in order if made by a delegation that voted on the prevailing side.",
        "Accept the motion and put it to a vote without debate.",
        "Allow a brief debate, then vote on reconsideration.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "A motion to reconsider is often in order when made by a member of the prevailing side. You accept it and put it to a vote per your rules.",
        correct:
          "You accept the motion to reconsider. You verify the delegate voted on the prevailing side (if required). You put the motion to a vote; it fails. The resolution stands as passed.",
      },
    },
    {
      phase: "Opening speeches",
      scenario:
        "A speaker has 60 seconds. At 45 seconds they yield the remainder to questions. Three delegations have their placards up. What do you do?",
      options: [
        "Allow all three to ask questions in order.",
        "Recognize one delegate to ask a question; time may run out before more.",
        "Rule that yielding to questions is not in order for opening speeches.",
        "Add 30 seconds to the clock for questions.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "When a speaker yields to questions, the chair recognizes questioners; remaining time applies. You recognize one delegate; they ask a question and the speaker responds. Time may run out.",
        correct:
          "You recognize one delegate for a question. The speaker responds. If time remains, you may recognize another. When time expires, you gavel and recognize the next speaker on the list.",
      },
    },
    {
      phase: "Floor open",
      scenario:
        "A delegate moves to suspend the meeting for 10 minutes. What do you do?",
      options: [
        "Rule the motion out of order.",
        "Accept the motion; it is usually not debatable and requires a majority.",
        "Accept the motion and allow 5 minutes of debate.",
        "Suspend the meeting immediately without a vote.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "A motion to suspend the meeting (recess) is typically not debatable and requires a majority. You put it to a vote and suspend if it passes.",
        correct:
          "You accept the motion to suspend the meeting. You put it to an immediate vote. It passes. You announce the 10-minute recess and gavel out. You resume in 10 minutes.",
      },
    },
    {
      phase: "Moderated caucus",
      scenario:
        "During a moderated caucus, no one has their placard up for the speakers list. What do you do?",
      options: [
        "Close the caucus immediately.",
        "Announce that the list is open and wait a moment; if no one adds their name, you may close the caucus or extend briefly.",
        "Automatically extend the caucus by 5 minutes.",
        "Switch to an unmoderated caucus.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "When no one is on the list, the chair may announce and wait, then close the caucus or give a short extension. You do so and the committee moves on.",
        correct:
          "You announce that the speakers list is open. After a short pause, no one adds their name. You close the moderated caucus and open the floor for motions.",
      },
    },
    {
      phase: "Points and motions",
      scenario:
        "A delegate raises a Point of Order and says the previous speaker used inappropriate language. What do you do?",
      options: [
        "Ignore the point; the speech is over.",
        "Recognize the point, rule on whether the language was inappropriate, and warn or sanction the speaker if necessary.",
        "Put it to the committee to vote on whether the language was inappropriate.",
        "Allow the speaker to apologize and continue.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Points of Order address procedural or behavioral issues. You recognize the point, make a ruling, and may warn the speaker. The session continues.",
        correct:
          "You recognize the Point of Order. You rule that the language was out of order and issue a warning to the delegation. You remind the committee of decorum and recognize the next speaker.",
      },
    },
    {
      phase: "Voting procedure",
      scenario:
        "The committee is voting on an amendment. A delegate moves to close the debate on the amendment. What do you do?",
      options: [
        "Rule the motion out of order; debate cannot be closed on amendments.",
        "Accept the motion to close debate; put it to an immediate vote. If it passes, vote on the amendment.",
        "Allow two more speakers for and against, then vote.",
        "Table the amendment.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "A motion to close debate is typically in order; it is not debatable and requires a two-thirds majority. You put it to a vote and then vote on the amendment if it passes.",
        correct:
          "You accept the motion to close debate. You put it to an immediate vote. It passes. You then take the vote on the amendment. The amendment fails, and the committee moves to the next item.",
      },
    },
    {
      phase: "Roll call",
      scenario:
        "You have completed roll call. The rapporteur reports: 25 present, 3 present and voting, 2 absent. What do you do?",
      options: [
        "Ask the rapporteur to recalculate; present and voting are a subset of present.",
        "Accept the report; in some committees 'present' and 'present and voting' are reported separately.",
        "Rule that delegations must be either present or present and voting, not both categories.",
        "Take roll call again.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Reporting can vary: some committees report 'present' and 'present and voting' as separate counts. You accept the report and announce the quorum. The session continues.",
        correct:
          "You accept the report. You announce that there are 28 present (25 + 3) and 2 absent, and that 3 are present and voting. You confirm quorum and move to the next item.",
      },
    },
    {
      phase: "Floor open",
      scenario:
        "A delegate moves to adopt the resolution by consensus without a vote. What do you do?",
      options: [
        "Rule the motion out of order; all resolutions must be voted on.",
        "Accept the motion; if there is no objection, the resolution is adopted by consensus.",
        "Put it to a vote on whether to adopt by consensus.",
        "Allow the resolution to be adopted only with a two-thirds vote.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Adopting by consensus is in order in many committees. You ask if there is any objection; there is none. You declare the resolution adopted by consensus.",
        correct:
          "You accept the motion. You ask, 'Is there any objection?' There is none. You declare the resolution adopted by consensus. The committee applauds.",
      },
    },
    {
      phase: "Moderated caucus",
      scenario:
        "A delegate on the speakers list is not in the room when their name is called. What do you do?",
      options: [
        "Mark them absent and remove them from the list for the rest of the session.",
        "Call their name again once or twice; if no response, skip to the next speaker and they may re-add their name when they return.",
        "Pause the caucus until they return.",
        "Close the caucus.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "When a speaker is not present, the chair typically calls again, then skips to the next. The delegate may re-add when they return. You do so and the caucus continues.",
        correct:
          "You call the delegate again. No response. You skip to the next speaker on the list and announce that the skipped delegate may re-add their name when they return. The caucus continues.",
      },
    },
    {
      phase: "Points and motions",
      scenario:
        "A delegate moves to extend the moderated caucus by 5 minutes. The current caucus has 2 minutes left. What do you do?",
      options: [
        "Rule the motion out of order; cannot extend an ongoing caucus.",
        "Accept the motion and put it to a vote. If it passes, extend the caucus.",
        "Extend without a vote to be fair to delegates.",
        "Close the caucus and move for a new one with the extended time.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "A motion to extend a caucus is typically in order and requires a vote. You put it to a vote and extend if it passes.",
        correct:
          "You accept the motion to extend the moderated caucus by 5 minutes. You put it to a vote. It passes. You announce the extension and the caucus continues.",
      },
    },
    {
      phase: "Voting procedure",
      scenario:
        "During a roll-call vote, a delegation says 'Abstain.' Another delegation says 'Pass' when their name is called. What do you do?",
      options: [
        "Count 'Pass' as abstain.",
        "Note the pass; call them again at the end of the roll call to record their vote.",
        "Rule that 'Pass' is not allowed; they must vote yes, no, or abstain.",
        "Mark them absent.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "In roll-call voting, a delegation may pass and be called again at the end. You note the pass and continue. At the end you call them again for their final vote.",
        correct:
          "You note the pass. You continue the roll call. After all other delegations have voted, you call the passing delegation again. They vote yes. You announce the result.",
      },
    },
    {
      phase: "Opening speeches",
      scenario:
        "A speaker yields their remaining time to another delegation. That delegation uses the time to attack another delegation personally. What do you do?",
      options: [
        "Let them finish; no points are in order during a yield.",
        "Rule the speaker out of order for unparliamentary language and gavel them down.",
        "Allow the attacked delegation to respond with a point of order.",
        "Suspend the session.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Personal attacks and unparliamentary language are out of order. You rule the speaker out of order and gavel them down. You remind the committee of decorum.",
        correct:
          "You rule the speaker out of order. You gavel them down and remind the committee that personal attacks are not permitted. You recognize the next speaker on the list.",
      },
    },
    {
      phase: "Floor open",
      scenario:
        "Two delegations claim they have the floor: one moved a motion first, the other was recognized by the chair earlier. What do you do?",
      options: [
        "Give the floor to whoever the committee prefers.",
        "The delegation that moved the motion has the floor to speak to it; the chair should clarify who has the floor.",
        "Put it to a vote.",
        "Suspend for chair consultation.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "The chair clarifies who has the floor—typically the mover has the right to speak first to their motion. You recognize the mover and the session continues.",
        correct:
          "You clarify that the mover of the motion has the floor to speak to it. You recognize that delegation. After they speak, you may open the floor for others or put the motion to a vote.",
      },
    },
    {
      phase: "Unmoderated caucus",
      scenario:
        "A delegate moves for an unmoderated caucus of 20 minutes. The rules state unmoderated caucuses may not exceed 15 minutes. What do you do?",
      options: [
        "Accept the motion and put it to a vote.",
        "Rule the motion out of order; the duration exceeds the rules. Ask them to move for 15 minutes or less.",
        "Accept the motion but cap the caucus at 15 minutes.",
        "Put it to a vote on suspending the rules.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Motions that conflict with the rules are out of order. You rule the motion out of order and ask for a motion within the 15-minute limit.",
        correct:
          "You rule the motion out of order because it exceeds the 15-minute limit. You ask the delegate to move for 15 minutes or less. They move for 15 minutes; the motion is put to a vote and passes.",
      },
    },
    {
      phase: "Moderated caucus",
      scenario:
        "The topic of the moderated caucus is 'Refugee integration.' A delegate speaks only about border security. What do you do?",
      options: [
        "Allow it; border security is related.",
        "Rule the delegate out of order for being off-topic; recognize the next speaker.",
        "Extend the caucus to allow multiple topics.",
        "Warn the delegate but let them finish.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Moderated caucus speakers must stay on the announced topic. You rule the delegate out of order and recognize the next speaker.",
        correct:
          "You rule the delegate out of order for being off-topic. You remind the committee that the caucus topic is refugee integration. You recognize the next speaker.",
      },
    },
    {
      phase: "Points and motions",
      scenario:
        "A delegate raises a Point of Order during voting procedure, after the vote has been called. What do you do?",
      options: [
        "Rule that points are not in order after the vote has been called.",
        "Recognize the point only if it relates to the conduct of the vote (e.g., improper procedure).",
        "Allow the point and reopen the vote.",
        "Table the point and announce the result.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Points of Order that relate to the conduct of the vote may be in order. You recognize the point, rule on it, and then announce the result or re-vote if necessary.",
        correct:
          "You recognize the Point of Order. The delegate points out that a delegation voted after the vote was closed. You rule: that vote is not counted. You announce the corrected result.",
      },
    },
    {
      phase: "Voting procedure",
      scenario:
        "The committee has two draft resolutions, A and B. A delegate moves to merge them into one. What do you do?",
      options: [
        "Rule the motion out of order; resolutions cannot be merged once on the floor.",
        "Accept the motion; if the committee agrees by vote, merge the resolutions.",
        "Accept the motion and merge without a vote.",
        "Vote on A first, then B; no merging.",
      ],
      correctIndex: 0,
      narratives: {
        wrong: "Merging two distinct draft resolutions into one is typically not in order once they are on the floor; they are voted on separately. You rule the motion out of order and proceed to vote on A, then B.",
        correct:
          "You rule the motion out of order. You explain that draft resolutions are voted on as submitted. You take the vote on resolution A, then on resolution B. The session continues.",
      },
    },
    {
      phase: "Roll call",
      scenario:
        "During roll call, a delegation responds in a language other than the committee's working language. What do you do?",
      options: [
        "Mark them absent.",
        "Ask them to respond in the working language; if they repeat in the same language, accept the response and continue.",
        "Rule them out of order and skip to the next delegation.",
        "Suspend roll call for a translation.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "The chair may request the working language. If the delegation does not comply or the response is clear (e.g., 'Present'), you may accept and continue.",
        correct:
          "You ask the delegation to respond in the working language. They respond 'Present' in the working language. Roll call continues.",
      },
    },
    {
      phase: "Opening speeches",
      scenario:
        "The time limit for opening speeches is 90 seconds. A delegate speaks for 95 seconds. No point of order was raised. What do you do?",
      options: [
        "Ignore the 5 seconds; no one objected.",
        "Note the overtime and remind the next speaker of the time limit.",
        "Gavel the current speaker down and deduct time from their next speech.",
        "Suspend the list and issue a warning to the committee.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "The chair is responsible for time. You may note the overtime and remind the committee of the limit. You do so and the session continues.",
        correct:
          "You note that the speaker went 5 seconds over. You remind the committee of the 90-second limit and recognize the next speaker. Opening speeches continue.",
      },
    },
    {
      phase: "Floor open",
      scenario:
        "A delegate moves to limit the number of times a delegation may speak on the same topic to two. What do you do?",
      options: [
        "Rule the motion out of order.",
        "Accept the motion and put it to a vote. If it passes, enforce the limit.",
        "Accept the motion without a vote.",
        "Allow unlimited speeches but warn after two.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "A motion to limit speeches is often in order. You accept it and put it to a vote. If it passes, you enforce the limit for the session.",
        correct:
          "You accept the motion. You put it to a vote. It passes. You announce the rule and enforce it for the remainder of the session. The committee continues.",
      },
    },
    {
      phase: "Moderated caucus",
      scenario:
        "A delegate requests to be removed from the speakers list. What do you do?",
      options: [
        "Refuse; once on the list, they must speak.",
        "Remove them from the list and continue to the next speaker.",
        "Put it to a vote of the committee.",
        "Allow it only if they have not yet spoken.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "A delegate may withdraw from the speakers list. You remove their name and recognize the next speaker.",
        correct:
          "You remove the delegate from the speakers list. You recognize the next speaker. The caucus continues.",
      },
    },
    {
      phase: "Voting procedure",
      scenario:
        "An amendment has been proposed to add an operative clause. A delegate moves to amend the amendment (a 'friendly' sub-amendment). What do you do?",
      options: [
        "Rule that sub-amendments are not in order.",
        "Accept the sub-amendment; it is voted on first, then the main amendment.",
        "Merge the sub-amendment into the main amendment without a vote.",
        "Table both and vote on the resolution as a whole.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "Sub-amendments are typically in order. You accept the sub-amendment; the committee votes on it first, then on the main amendment.",
        correct:
          "You accept the sub-amendment. You put the sub-amendment to a vote first; it passes. You then put the main amendment (as modified) to a vote. It fails. The resolution is voted on without that clause.",
      },
    },
    {
      phase: "Points and motions",
      scenario:
        "A delegate raises a Point of Order and says the chair made an error in the last ruling. What do you do?",
      options: [
        "Rule the point out of order; the chair's ruling stands.",
        "Recognize the point; you may clarify or reverse your ruling if you agree you made an error.",
        "Put it to the committee to vote on the ruling.",
        "Suspend the session for consultation with the co-chair.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "The chair may clarify or reverse a ruling when a point of order is raised. You consider the point and either affirm or correct your ruling. The session continues.",
        correct:
          "You recognize the point. You review the ruling and agree that you misspoke. You reverse the ruling and correct the procedure. The committee thanks the chair and continues.",
      },
    },
    {
      phase: "Unmoderated caucus",
      scenario:
        "Delegates are forming blocs during an unmoderated caucus. One delegation complains that another is excluding them. What do you do?",
      options: [
        "Rule that all blocs must be inclusive and disband the bloc.",
        "Explain that unmoderated caucus is for informal discussion; the chair does not assign blocs. Encourage the delegation to reach out or form their own group.",
        "Assign delegations to blocs to be fair.",
        "End the caucus and return to formal session.",
      ],
      correctIndex: 1,
      narratives: {
        wrong: "The chair does not assign blocs. You explain that the caucus is informal and encourage the delegation to engage with others. The caucus continues.",
        correct:
          "You explain that during unmoderated caucus, delegations form groups informally and the chair does not assign them. You encourage the delegation to approach other groups or form their own. The caucus continues.",
      },
    },
  ];

  function shuffleArray(arr) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  const state = {
    currentIndex: 0,
    score: 0,
    totalAnswered: 0,
    answered: false,
    sessionQuestions: [],
  };

  const elements = {
    questionProgress: document.getElementById("questionProgress"),
    sessionPhase: document.getElementById("sessionPhase"),
    sessionProgressBar: document.getElementById("sessionProgressBar"),
    scenarioBlock: document.getElementById("scenarioBlock"),
    scenarioText: document.getElementById("scenarioText"),
    optionsList: document.getElementById("optionsList"),
    feedbackBlock: document.getElementById("feedbackBlock"),
    feedbackHeader: document.getElementById("feedbackHeader"),
    feedbackIcon: document.getElementById("feedbackIcon"),
    feedbackTitle: document.getElementById("feedbackTitle"),
    feedbackBody: document.getElementById("feedbackBody"),
    correctAnswerBox: document.getElementById("correctAnswerBox"),
    correctAnswerText: document.getElementById("correctAnswerText"),
    narrativeOutcome: document.getElementById("narrativeOutcome"),
    continueBtn: document.getElementById("continueBtn"),
    scoreDisplay: document.getElementById("scoreDisplay"),
    chairFunFact: document.getElementById("chairFunFact"),
    welcomeOverlay: document.getElementById("welcomeOverlay"),
    startChairSession: document.getElementById("startChairSession"),
    endOverlay: document.getElementById("endOverlay"),
    endMessage: document.getElementById("endMessage"),
    endNote: document.getElementById("endNote"),
    restartChairSession: document.getElementById("restartChairSession"),
    questionCountSelect: document.getElementById("questionCountSelect"),
  };

  let procedureFunFactIndex = 0;
  let procedureFunFactInterval = null;

  function displayProcedureFunFact() {
    if (!elements.chairFunFact || procedureFunFacts.length === 0) return;
    const el = elements.chairFunFact.querySelector(".chair-fun-fact-text");
    if (!el) return;
    el.textContent = procedureFunFacts[procedureFunFactIndex];
    procedureFunFactIndex = (procedureFunFactIndex + 1) % procedureFunFacts.length;
  }

  function updateScoreDisplay() {
    elements.scoreDisplay.textContent = state.score + " / " + state.totalAnswered;
  }

  function updateProgress() {
    const total = state.sessionQuestions.length;
    if (total === 0) return;
    elements.questionProgress.textContent = state.currentIndex + 1 + " / " + total;
    elements.sessionProgressBar.style.width = (state.currentIndex / total) * 100 + "%";
  }

  function showQuestion() {
    state.answered = false;
    const q = state.sessionQuestions[state.currentIndex];
    const emoji = phaseEmoji[q.phase] || "📌";
    elements.sessionPhase.textContent = emoji + " " + q.phase;
    elements.scenarioText.textContent = q.scenario;
    elements.optionsList.innerHTML = "";
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "procedure-option";
      btn.textContent = opt;
      btn.dataset.index = String(i);
      btn.addEventListener("click", () => onOptionClick(i));
      elements.optionsList.appendChild(btn);
    });
    elements.scenarioBlock.classList.remove("hidden");
    elements.feedbackBlock.classList.add("hidden");
    elements.continueBtn.style.display = "none";
    updateProgress();
  }

  function onOptionClick(selectedIndex) {
    if (state.answered) return;
    state.answered = true;
    state.totalAnswered += 1;
    const q = state.sessionQuestions[state.currentIndex];
    const correct = selectedIndex === q.correctIndex;
    if (correct) state.score += 1;

    // Disable and mark options
    const buttons = elements.optionsList.querySelectorAll(".procedure-option");
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correctIndex) btn.classList.add("option-correct");
      if (i === selectedIndex && !correct) btn.classList.add("option-incorrect");
    });

    elements.feedbackIcon.textContent = correct ? "✓" : "✗";
    elements.feedbackIcon.className = "feedback-icon " + (correct ? "correct" : "incorrect");
    elements.feedbackTitle.textContent = correct ? "✅ Correct" : "❌ Incorrect";
    elements.feedbackBody.textContent = correct ? "Your response follows standard procedure." : "Your response is not the standard procedure in this situation.";
    elements.correctAnswerBox.classList.toggle("hidden", correct);
    if (!correct) {
      elements.correctAnswerText.textContent = q.options[q.correctIndex];
    }
    elements.narrativeOutcome.textContent = correct ? q.narratives.correct : q.narratives.wrong;
    elements.narrativeOutcome.classList.remove("correct-narrative", "wrong-narrative");
    elements.narrativeOutcome.classList.add(correct ? "correct-narrative" : "wrong-narrative");

    elements.feedbackBlock.classList.remove("hidden");
    elements.continueBtn.style.display = "block";
    updateScoreDisplay();
  }

  function continueSession() {
    state.currentIndex += 1;
    if (state.currentIndex >= state.sessionQuestions.length) {
      elements.scenarioBlock.classList.add("hidden");
      elements.feedbackBlock.classList.add("hidden");
      elements.endMessage.textContent =
        "You got " + state.score + " out of " + state.totalAnswered + " procedure questions correct. Use this feedback to refine your chairing.";
      const pct = state.totalAnswered > 0 ? state.score / state.totalAnswered : 0;
      if (pct > 0.8) {
        elements.endNote.textContent = "You got best chair!";
        elements.endNote.className = "end-note end-note-best";
      } else {
        elements.endNote.textContent = "Try again next time!";
        elements.endNote.className = "end-note end-note-try";
      }
      elements.endOverlay.classList.remove("hidden");
      return;
    }
    showQuestion();
  }

  function startSession() {
    const count = Math.min(50, Math.max(5, parseInt(elements.questionCountSelect.value, 10) || 10));
    state.sessionQuestions = shuffleArray(procedureQuestions).slice(0, count);
    state.currentIndex = 0;
    state.score = 0;
    state.totalAnswered = 0;
    elements.welcomeOverlay.classList.add("hidden");
    elements.endOverlay.classList.add("hidden");
    updateScoreDisplay();
    showQuestion();
  }

  function init() {
    displayProcedureFunFact();
    procedureFunFactInterval = setInterval(displayProcedureFunFact, 5 * 60 * 1000);
    if (elements.chairFunFact) {
      elements.chairFunFact.addEventListener("click", displayProcedureFunFact);
    }
    elements.startChairSession.addEventListener("click", startSession);
    elements.continueBtn.addEventListener("click", continueSession);
    elements.restartChairSession.addEventListener("click", startSession);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
