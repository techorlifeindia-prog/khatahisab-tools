# Pending Work & Tasks (बाकी बचे हुए काम)

This file tracks the pending work and future tasks for the KhataHisab Tools project.
(इस फाइल में KhataHisab Tools प्रोजेक्ट के पेंडिंग काम और भविष्य में होने वाले कामों की लिस्ट है।)

## High Priority (ज़रूरी काम)
- [ ] **Check Google API Quota:** We applied to increase the Google My Business API quota (which was initially 0). Need to verify if the limit has been increased.
      *(चेक करना कि Google API की लिमिट जो हमने फॉर्म भरकर बढ़ाई थी, वो अप्रूव हुई या नहीं।)*
- [ ] **Disable Mock Mode for Reviews:** Once the Google API limit is approved, go to `src/app/api/reviews/route.ts` and set `const MOCK_MODE = false;` to fetch live reviews from Google instead of fake data.
      *(जब लिमिट अप्रूव हो जाए, तो `src/app/api/reviews/route.ts` में जाकर `MOCK_MODE = false;` करना है, ताकि असली रिव्यू दिखने लगें।)*

## Features & Improvements (नए फीचर और सुधार)
- [ ] **Google Reviews Pagination:** The Google Reviews API currently fetches the default limit (around 50 reviews). If the business has more reviews, we need to add `?pageSize=50` to the API URL and implement `nextPageToken` logic to fetch all pages.
      *(अभी Google सिर्फ 50 रिव्यू दे रहा है। अगर 50 से ज़्यादा रिव्यू लाने हैं, तो API URL में `?pageSize=50` और `nextPageToken` (Pagination) का लॉजिक लगाना होगा।)*
- [ ] **User Role Management:** Expand the Admin Dashboard to allow changing user roles (e.g., from User to Admin) if required in the future.
      *(एडमिन पैनल में ऐसा सिस्टम बनाना ताकि हम किसी भी यूज़र का रोल बदल सकें, जैसे किसी 'User' को 'Admin' बनाना।)*

*(Add new pending tasks here as they come up / कोई भी नया काम आए तो उसे यहाँ जोड़ें)*
