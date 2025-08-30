import { useCallback, forwardRef, ReactNode } from "react";
import { StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetProps,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { wp } from "@/helpers/common";

interface BottomSheetComponentProps extends Partial<BottomSheetProps> {
  children: ReactNode;
  cb?: (index: number) => void;
  snapPoints: string[];
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetComponentProps>(
  ({ cb, children, snapPoints, ...props }, ref) => {
    const handleSheetChanges = useCallback(
      (index: number) => {
        cb?.(index);
      },
      [cb]
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      []
    );

    return (
      <BottomSheet
        ref={ref}
        backdropComponent={renderBackdrop}
        snapPoints={snapPoints}
        index={-1}
        onChange={handleSheetChanges}
        enablePanDownToClose
        {...props}
      >
        <BottomSheetView style={styles.content}>{children}</BottomSheetView>
      </BottomSheet>
    );
  }
);

BottomSheetComponent.displayName = "BottomSheetComponent";

export default BottomSheetComponent;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: wp(5),
  },
});
