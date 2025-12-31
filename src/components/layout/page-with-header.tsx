// import React, { useRef, useState } from 'react';
// import { View, ScrollView } from 'react-native';
// import AppHeader from './app-header';
// import { verticalScale } from '../../utils/sizer';
// import Sidebar, { SidebarRef } from './sidebar';

// interface PageWithHeaderProps {
//   children: React.ReactNode;
//   rounded?: boolean;
//   scrollHeader?: boolean; // controls header color change on scroll
//   themeMode?: 'light' | 'dark';
//   scroll?: boolean; // NEW: controls whether content is wrapped in ScrollView
// }

// const PageWithHeader = ({
//   children,
//   rounded,
//   scrollHeader = false,
//   themeMode,
//   scroll = true,
// }: PageWithHeaderProps) => {
//   const [scrolled, setScrolled] = useState(true);
//   const sidebarRef = useRef<SidebarRef>(null);

//   const content = (
//     <View
//       style={{
//         paddingTop: verticalScale(80),
//         minHeight: '100%',
//         flex: 1,
//       }}
//     >
//       {children}
//     </View>
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       <AppHeader
//         scrolled={scrolled}
//         rounded={rounded}
//         onMenuPress={() => sidebarRef.current?.open()}
//         themeMode={themeMode}
//       />

//       {scroll ? (
//         <ScrollView
//           scrollEventThrottle={16}
//           onScroll={e => {
//             const y = e.nativeEvent.contentOffset.y;

//             if (scrollHeader) {
//               setScrolled(y > 10);
//             } else {
//               setScrolled(true);
//             }
//           }}
//         >
//           {content}
//         </ScrollView>
//       ) : (
//         // no ScrollView: let FlatList or other VirtualizedList handle scroll
//         <View style={{ flex: 1 }}>{content}</View>
//       )}

//       <Sidebar ref={sidebarRef} />
//     </View>
//   );
// };

// export default PageWithHeader;

import React, { useRef, useState } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';

import AppHeader from './app-header';
import Sidebar, { SidebarRef } from './sidebar';

import { verticalScale } from '../../utils/sizer';
import { COLORS } from '../../constant/colors';

import { useAppDispatch, useAppSelector } from '../../hooks/redux-hook';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../../store/reducer/auth';

interface PageWithHeaderProps {
  children: React.ReactNode;
  rounded?: boolean;
  scrollHeader?: boolean;
  themeMode?: 'light' | 'dark';
  scrollEnabled?: boolean; // replaces old `scroll`
  title?: string;
}

const PageWithHeader = ({
  children,
  rounded,
  scrollHeader = false,
  themeMode = 'dark',
  scrollEnabled = true,
  title = '',
}: PageWithHeaderProps) => {
  const [scrolled, setScrolled] = useState(true);
  const sidebarRef = useRef<SidebarRef>(null);

  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { user } = useAppSelector(state => state.auth);

  // const { disconnect } = useWebSocket(user?.id);

  // const handleLogout = () => {
  //   // disconnect();
  //   dispatch(logout());
  // };

  /* ---------- CONTENT WRAPPER ---------- */
  const Content = (
    <View
      style={{
        paddingTop: verticalScale(80),
        minHeight: '100%',
        flex: 1,
      }}
    >
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* STATUS BAR */}
      <StatusBar
        backgroundColor={COLORS.theme.primary}
        barStyle="dark-content"
        animated
      />

      {/* HEADER */}
      <AppHeader
        scrolled={scrolled}
        rounded={rounded}
        themeMode={themeMode}
        title={title}
        canGoBack={navigation.canGoBack()}
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => sidebarRef.current?.open()}
        onNotificationPress={() => navigation.navigate('Notification')}
      />

      {/* BODY */}
      {scrollEnabled ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={e => {
            const y = e.nativeEvent.contentOffset.y;
            setScrolled(scrollHeader ? y > 10 : true);
          }}
        >
          {Content}
        </ScrollView>
      ) : (
        // for FlatList / VirtualizedList screens
        <View style={{ flex: 1 }}>{Content}</View>
      )}

      {/* SIDEBAR */}
      <Sidebar ref={sidebarRef} />
    </View>
  );
};

export default PageWithHeader;
