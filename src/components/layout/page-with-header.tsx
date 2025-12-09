import React, { useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';
import AppHeader from './app-header';
import { verticalScale } from '../../utils/sizer';
import Sidebar, { SidebarRef } from './sidebar';

interface PageWithHeaderProps {
  children: React.ReactNode;
  rounded?: boolean;
  scrollHeader?: boolean; // controls header color change on scroll
  themeMode?: 'light' | 'dark';
  scroll?: boolean; // NEW: controls whether content is wrapped in ScrollView
}

const PageWithHeader = ({
  children,
  rounded,
  scrollHeader = false,
  themeMode,
  scroll = true,
}: PageWithHeaderProps) => {
  const [scrolled, setScrolled] = useState(true);
  const sidebarRef = useRef<SidebarRef>(null);

  const content = (
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
      <AppHeader
        scrolled={scrolled}
        rounded={rounded}
        onMenuPress={() => sidebarRef.current?.open()}
        themeMode={themeMode}
      />

      {scroll ? (
        <ScrollView
          scrollEventThrottle={16}
          onScroll={e => {
            const y = e.nativeEvent.contentOffset.y;

            if (scrollHeader) {
              setScrolled(y > 10);
            } else {
              setScrolled(true);
            }
          }}
        >
          {content}
        </ScrollView>
      ) : (
        // no ScrollView: let FlatList or other VirtualizedList handle scroll
        <View style={{ flex: 1 }}>{content}</View>
      )}

      <Sidebar ref={sidebarRef} />
    </View>
  );
};

export default PageWithHeader;
