# Analytics Events and Attributes

### Event list

#### On Page Load

- [x] Page View (Track Screen View)
- [x] View Category
- [x] View Article
- [] Error Message Displayed
- [] External Campaign
- [] Search
- [] Embedded Video Load - Story
- [] Widget Vide Load - Widget
- [] Widget Playlist Load - Widget
- [] Widget Playlist Player Load
- [] Outfit Video Player Load
- [] Video Center
- [] View Subscribe Module (PAYWALL)
- [] View Registration/Sign In Module
    - [] Case - Signin Meter Login
    - [] Case - Signin Comments Login
    - [] Case - Traditional Registration Meter Account Creation
    - [] Case - Meter Plan Options
- [] View Verification Request Screen
- [] New Registration
- [] View Enter Credit Card Information Module

#### On Click

- [x] Widget Click
- [x] Navigation Click
- [] Internal Promotion Click
- [] Viafoura - User Like
- [] Viafoura - User Dislike
- [] Viafoura - User Updated
- [] Viafoura - User Comment
- [] Share Article
- [] Newsletter Subscribe

### Event Attributes

#### Page View (Track Screen View):

- Page Name
- Domain
- Division
- Brand
- Category
- All Sub Sections
- Sub Section
- Sub Section 2
- Sub Section 3
- 404 - String(true/false - must be passed as string)
- Vendor
- Login Status
- Metered Content Type
- Distributor
- Content ID
- Markup Language
- WordPress Sub Categories
- Sponsor
- Content Title
- Publication Date
- Publication Time of Day
- Page Type
- Time Hour Of Day
- Time Day Of Week
- Time WeekDay Or Weekend
- Ad Site
- WordPress Meta Tag Keywords
- Modification Date
- Modification Time of Day
- WordPress Global Slug
- Authors
- WordPress Category Type
- Driving Special Sections
- Driving Car Make
- Driving Compare Tool Filters
- Driving Compare Tool Count
- Driving Body Style Filters
- Driving Make And Model
- Analytics Debug Info

#### View Article (Event):

- Article Name
- Alternate Headline
- Article Category
- Article Sub Section
- Sub Section 2
- Excerpt
- Canonical Page Path
- Video Included
- Distributor
- Publish Date
- Publish Time of Day
- Story Type
- Writer Byline
- Current Page
- Driving Car Make
- Article Format
- Word Count
- WP Meta Tags
- Modification Date
- Modification Time of Day
- Global Post ID
- WCM ID
- WP Post ID
- Originating Property
- NLP Tags - Entity
- NLP Tags - Topic
- NLP Tags - Category
- Entity
- Paywall Whitelist
- Video Platforms
- Video IDs
- Video Placement Types

#### Error Message Displayed (Event): 

- Error Message

#### External Campaign (Event):

- Campaign ID

#### Internal Promotion Click (Event):

- Button Location
- Promotion Name

#### Search (Event):

- Search Terms
- Search Result Count

#### Embedded Video Load - Story (Event):

- Video Platform
- Video ID
- Video Placement Type

#### Widget Video Load - Widget (Event):

- Video Platform
- Video ID
- Video Title
- Video Published on
- Video Modified on
- Video Widget Title
- Video URL
- Video Widget ID
- Video Sidebar ID
- Kaltura Video ID
- Kaltura Video Title

#### Widget Playlist Load - Widget (Event):

- Playlist ID
- Playlist Title
- Playlist Widget ID
- Playlist sidebar ID

#### Widget Playlist Player Load - Ticker (Event):

- Playlist ID
- Playlist Widget ID
- Video Placement Type
- Category
- URL

#### Outfit Video Player Load (Event):

- Video ID
- Title
- Category
- URL
- Outfit
- Position

#### Video Center (Event):

- Video ID
- URL
- Outfit
- Outfit Position

#### Viafoura - User Like (Event):

- Like (received)
- Like (made)
- Page Title
- WCM ID
- WP Post ID

#### Viafoura - User Dislike (Event):

- Dislike (received)
- Dislike (made)
- Page Title
- WCM ID
- WP Post ID

#### Viafoura - User Updated (Event):

- Social Login ID
- Social Login Provider
- User Privilege
- Rank Subscriber Count

#### Viafoura - User Comment (Event):
- Total Comments
- Date Created
- Total Comments Made
- Total Comments Received (replies)
- Rank Comments Made
- Rank Comments Received
- Comments Rank Overall
- Comments Rank Subscriber Count
- Comments Rating
- Comment Level
- Comment type
- Page Title
- WCM ID
- WP Post ID

#### Share Article (Event):

- Global Post ID/Content ID
- WCM ID
- WP Post ID
- Article Name
- Article Category
- Article Sub-Category/Section
- Article Authors
- Share Channel
- Share Location on Page

#### Navigation Click (Event):

- Brand
- Navigation Location
- Name

#### Newsletter Subscribe (Event):
- Action
- Newsletter
- Source

#### Widget Click (Event):
- Widget Type
- Widget Name
- Category Name
- Widget Position
- Feed Name
- Feed ID
- Feed Position
- Feed Type
- Referring URL
- Story Headline
- Story URL
- Author Text
- Story Position
- Story ID

#### View Subscription Module (PAYWALL) (Event):
- Empty object

#### View Registration/Sign In Module (Event):
- Case - Signin Meter Login
    - {"Registration/Sign In Module Trigger": "Self-Sign In"}
- Case - Signin Comments Login
    - {"Registration/Sign In Module Trigger": "Comment"}
- Case - Traditional Registration Meter Account Creation
    - {"Registration/Sign In Module Trigger": "Self-Create Account"}
- Case - Meter Plan Options
    - {"Registration/Sign In Module Trigger": "Paywall Limit Reached"}

#### View Verification Request Screen (Event):
- Empty object

#### New Registration (Event):
- Empty Object

##### View Enter Credit Card Information Module (Event):
- Empty Object